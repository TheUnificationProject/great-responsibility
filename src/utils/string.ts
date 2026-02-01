// eslint-disable-next-line no-restricted-imports
import s from 'slugify';

export const SPECIAL_CHARS: Record<string, string> = {
  '#': ' sharp',
  '+': ' plus',
};

export function slugify(
  str: string,
  options: Exclude<Parameters<typeof s>[1], string> = {},
) {
  const { lower = true, strict = true, ...rest } = options;

  let processed = str;
  for (const [char, replacement] of Object.entries(SPECIAL_CHARS)) {
    processed = processed.replaceAll(char, replacement);
  }

  return s(processed, { lower, strict, ...rest });
}
