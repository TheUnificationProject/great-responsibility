import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  DATABASE_URL: z.string().nonempty(),
  DATABASE_SSL_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  REDIS_URL: z.string().nonempty().default('redis://localhost:6379'),

  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
  FIREBASE_MEASUREMENT_ID: z.string().optional(),

  SECRET_KEY: z.string().nonempty(),
});
