import { ImageExtension, ImageMimeType } from '@/types';
import type { File } from '@google-cloud/storage';
import { ConfigService } from '@modules/config/config.service';
import { FirebaseService } from '@modules/firebase/firebase.service';
import * as Types from '@modules/firebase/firebase.types';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IMAGE_EXTENSIONS, IMAGE_SIGNATURES_MAP } from '@utils/image';

@Injectable()
export class FirebaseStorageService {
  private readonly logger = new Logger(FirebaseStorageService.name);
  private readonly maxFileSizeMB: number;
  private readonly allowedImageTypes: string[];

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSizeMB = this.configService.get('FIREBASE_MAX_FILE_SIZE_MB');
    this.allowedImageTypes = this.configService
      .get('FIREBASE_ALLOWED_IMAGE_TYPES')
      .split(',');
  }

  private get bucket() {
    return this.firebaseService.storage.bucket();
  }

  /**
   * Upload an image to Firebase Storage
   * @param options Upload options including path, file buffer, etc.
   * @returns Upload result with URL and metadata
   * @throws BadRequestException if validation fails
   * @throws InternalServerErrorException if upload fails
   */
  async uploadImage(
    options: Types.FileUploadOptions,
  ): Promise<Types.FileUploadResult> {
    const { path, file, fileName, contentType, metadata } = options;

    // 1. Validate file
    const validation = this.validateImage(
      file,
      fileName,
      contentType as ImageMimeType,
    );
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    // 2. Build full storage path
    const fullPath = this.buildStoragePath(path, fileName);

    try {
      // 3. Get file reference from bucket
      const fileRef = this.bucket.file(fullPath);

      // 4. Upload file
      this.logger.log(`Uploading file to ${fullPath}`);
      await fileRef.save(file, {
        contentType,
        metadata: metadata ? { metadata } : undefined,
      });

      // 5. Get signed URL
      const url = await this.getSignedUrl(fileRef);

      this.logger.log(`File uploaded successfully: ${fullPath}`);

      return {
        url,
        path: fullPath,
        fileName,
        size: file.length,
        contentType,
        uploadedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Failed to upload file: ${fullPath}`, error);
      throw new InternalServerErrorException(
        'Failed to upload file to storage',
      );
    }
  }

  /**
   * Get public URL for a file
   * @param path Storage path
   * @returns Signed download URL
   * @throws NotFoundException if file doesn't exist
   * @throws InternalServerErrorException if operation fails
   */
  async getFileUrl(path: string): Promise<string> {
    try {
      const fileRef = this.bucket.file(path);
      const [exists] = await fileRef.exists();

      if (!exists) {
        throw new NotFoundException('File not found in storage');
      }

      return this.getSignedUrl(fileRef);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to get file URL: ${path}`, error);
      throw new InternalServerErrorException('Failed to get file URL');
    }
  }

  /**
   * Delete a file from storage
   * @param path Storage path
   * @throws NotFoundException if file doesn't exist
   * @throws InternalServerErrorException if operation fails
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = this.bucket.file(path);
      const [exists] = await fileRef.exists();

      if (!exists) {
        throw new NotFoundException('File not found in storage');
      }

      await fileRef.delete();
      this.logger.log(`File deleted successfully: ${path}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete file: ${path}`, error);
      throw new InternalServerErrorException(
        'Failed to delete file from storage',
      );
    }
  }

  /**
   * List files in a folder
   * @param folderPath Folder path
   * @returns Array of file metadata
   * @throws InternalServerErrorException if operation fails
   */
  async listFiles(folderPath: string): Promise<Types.FileUploadResult[]> {
    try {
      const [files] = await this.bucket.getFiles({ prefix: folderPath });

      const filesPromises = files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        const url = await this.getSignedUrl(file);

        return {
          url,
          path: file.name,
          fileName: file.name.split('/').pop() || file.name,
          size: Number(metadata.size) || 0,
          contentType: (metadata.contentType as string) || 'unknown',
          uploadedAt: new Date(metadata.timeCreated as string),
        };
      });

      return Promise.all(filesPromises);
    } catch (error) {
      this.logger.error(`Failed to list files in: ${folderPath}`, error);
      throw new InternalServerErrorException('Failed to list files');
    }
  }

  /**
   * Generate a signed URL for a file
   * @param file GCS file reference
   * @returns Signed URL valid for 7 days
   */
  private async getSignedUrl(file: File): Promise<string> {
    const [url] = await file.getSignedUrl({
      action: 'read' as const,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return url;
  }

  /**
   * Validate image file
   * @param file File buffer
   * @param fileName File name
   * @param contentType MIME type
   * @returns Validation result
   */
  private validateImage(
    file: Buffer,
    fileName: string,
    contentType: ImageMimeType,
  ): Types.FileValidationResult {
    // 1. Check file size
    const maxSizeBytes = this.maxFileSizeMB * 1024 * 1024;
    if (file.length > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${this.maxFileSizeMB}MB`,
      };
    }

    // 2. Check MIME type
    if (!this.allowedImageTypes.includes(contentType)) {
      return {
        isValid: false,
        error: `File type ${contentType} is not allowed. Allowed types: ${this.allowedImageTypes.join(', ')}`,
      };
    }

    // 3. Check file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || !IMAGE_EXTENSIONS.includes(extension as ImageExtension)) {
      return {
        isValid: false,
        error: `Invalid file extension. Allowed extensions: ${IMAGE_EXTENSIONS.join(', ')}`,
      };
    }

    // 4. Verify magic numbers (prevent malicious files)
    const signature = IMAGE_SIGNATURES_MAP[contentType];
    if (signature) {
      const fileHeader = Array.from(file.slice(0, signature.length));
      const signatureMatches = signature.every(
        (byte, index) => byte === fileHeader[index],
      );

      if (!signatureMatches) {
        return {
          isValid: false,
          error:
            'Invalid image file: file signature does not match declared type',
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Build full storage path
   * @param basePath Base path (e.g., 'profiles/avatars')
   * @param fileName File name
   * @returns Full storage path
   */
  private buildStoragePath(basePath: string, fileName: string): string {
    // Sanitize filename: remove special characters and spaces
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_');

    // Build full path (no leading slash for Firebase Storage)
    const fullPath = `${basePath}/${sanitizedFileName}`;

    return fullPath;
  }
}
