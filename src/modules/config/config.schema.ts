import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  DATABASE_URL: z.string().nonempty(),
  DATABASE_SSL_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
});
