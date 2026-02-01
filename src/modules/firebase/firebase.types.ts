import { googleCredentialsSchema } from '@modules/config/config.schema';
import { App as FirebaseApp } from 'firebase-admin/app';
import { Storage as FirebaseStorage } from 'firebase-admin/storage';
import { z } from 'zod';

export type FirebaseAppInstance = FirebaseApp;
export type FirebaseStorageInstance = FirebaseStorage;

export type FileUploadOptions = {
  path: string;
  file: Buffer;
  fileName: string;
  contentType: string;
  metadata?: Record<string, string>;
};

export type FileUploadResult = {
  url: string;
  path: string;
  fileName: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
};

export type FileValidationResult = {
  isValid: boolean;
  error?: string;
};

export enum StoragePath {
  SKILL_ICONS = 'skills/icons',
}

export type GoogleCredentials = z.infer<typeof googleCredentialsSchema>;
