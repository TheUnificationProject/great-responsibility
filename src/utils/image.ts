import { ImageExtension, ImageMimeType } from '@/types';

export const IMAGE_EXTENSIONS = Object.values(ImageExtension);
export const IMAGE_MIME_TYPES = Object.values(ImageMimeType);

export const IMAGE_MIME_MAP: Record<ImageExtension, ImageMimeType> = {
  [ImageExtension.JPG]: ImageMimeType.JPEG,
  [ImageExtension.JPEG]: ImageMimeType.JPEG,
  [ImageExtension.PNG]: ImageMimeType.PNG,
  [ImageExtension.WEBP]: ImageMimeType.WEBP,
  [ImageExtension.SVG]: ImageMimeType.SVG,
};

export const IMAGE_SIGNATURES_MAP: Record<ImageMimeType, number[]> = {
  [ImageMimeType.JPEG]: [0xff, 0xd8, 0xff],
  [ImageMimeType.PNG]: [0x89, 0x50, 0x4e, 0x47],
  [ImageMimeType.WEBP]: [0x52, 0x49, 0x46, 0x46],
  // SVG files start with '<' (0x3C) or XML declaration
  [ImageMimeType.SVG]: [0x3c],
};

export function getMimeTypeFromExtension(ext: string): Optional<ImageMimeType> {
  return IMAGE_MIME_MAP[ext as ImageExtension];
}
