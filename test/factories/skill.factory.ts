import { SkillEntity } from 'optimus-package';

let counter = 0;

export function createSkillEntity(
  overrides: Partial<SkillEntity> = {},
): SkillEntity {
  counter++;
  return {
    slug: `skill-${counter}`,
    label: `Skill ${counter}`,
    iconUrl: null,
    category: 'language',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    deletedAt: null,
    ...overrides,
  };
}
