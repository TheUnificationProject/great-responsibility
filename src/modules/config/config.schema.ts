import { IMAGE_MIME_TYPES } from '@utils/image';
import { z } from 'zod';
import * as Utils from './config.utils';

export const googleCredentialsSchema = z
  .object({
    type: z.string().nonempty(),
    project_id: z.string().nonempty(),
    private_key_id: z.string().nonempty(),
    private_key: z.string().nonempty(),
    client_email: z.email(),
    client_id: z.string().nonempty(),
    auth_uri: z.url(),
    token_uri: z.url(),
    auth_provider_x509_cert_url: z.url(),
    client_x509_cert_url: z.url(),
    universe_domain: z.string().nonempty(),
  })
  .transform((schema) => ({
    type: schema.type,
    projectId: schema.project_id,
    privateKeyId: schema.private_key_id,
    privateKey: schema.private_key,
    clientEmail: schema.client_email,
    clientId: schema.client_id,
    authUri: schema.auth_uri,
    tokenUri: schema.token_uri,
    authProviderX509CertUrl: schema.auth_provider_x509_cert_url,
    clientX509CertUrl: schema.client_x509_cert_url,
    universeDomain: schema.universe_domain,
  }));

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  DATABASE_URL: z.string().nonempty(),
  DATABASE_SSL_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  REDIS_URL: z.string().nonempty().default('redis://localhost:6379'),

  GOOGLE_APPLICATION_CREDENTIALS: z
    .string()
    .nonempty()
    .transform(Utils.transformGoogleCredentials)
    .pipe(googleCredentialsSchema),

  FIREBASE_STORAGE_BUCKET: z.string().nonempty(),

  FIREBASE_MAX_FILE_SIZE_MB: z.string().default('5').transform(Number),
  FIREBASE_ALLOWED_IMAGE_TYPES: z.string().default(IMAGE_MIME_TYPES.join(',')),

  SECRET_KEY: z.string().nonempty(),
});
