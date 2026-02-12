import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

export function transformGoogleCredentials(
  filename: string,
  ctx: z.RefinementCtx,
) {
  const filepath = join(process.cwd(), 'secrets', filename);

  let fileContent: string;
  try {
    fileContent = readFileSync(filepath, 'utf-8');
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Cannot read credentials file at "${filepath}". Make sure the file exists in src/secrets/.`,
    });
    return z.NEVER;
  }

  try {
    return JSON.parse(fileContent) as unknown;
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid JSON in credentials file "${filename}".`,
    });
    return z.NEVER;
  }
}
