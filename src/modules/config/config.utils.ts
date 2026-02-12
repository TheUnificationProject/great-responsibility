import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

export function transformGoogleCredentials(
  filename: string,
  ctx: z.RefinementCtx,
) {
  const cwd = process.cwd();
  const candidates = [
    join(cwd, 'secrets', filename),
    join(cwd, 'src/secrets', filename),
  ];

  let fileContent: string | undefined;
  for (const candidate of candidates) {
    try {
      fileContent = readFileSync(candidate, 'utf-8');
      break;
    } catch {
      // try next candidate
    }
  }

  if (!fileContent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Cannot read credentials file "${filename}". Looked in: ${candidates.join(', ')}`,
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
