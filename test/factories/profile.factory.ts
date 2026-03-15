import { ref } from '@mikro-orm/core';
import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package/entities';

let counter = 0;

export function createLinkedInProfileEntity(
  overrides: Partial<LinkedInProfileEntity> = {},
): Partial<LinkedInProfileEntity> {
  counter++;
  return {
    uuid: `uuid-linkedin-${counter}`,
    slug: undefined,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function createGitHubProfileEntity(
  overrides: Partial<GitHubProfileEntity> = {},
): Partial<GitHubProfileEntity> {
  counter++;
  return {
    uuid: `uuid-github-${counter}`,
    username: undefined,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function createProfileEntity(
  overrides: Partial<ProfileEntity> = {},
): Partial<ProfileEntity> {
  counter++;

  const uuid = overrides.uuid ?? `uuid-profile-${counter}`;
  const {
    linkedInProfile = ref(LinkedInProfileEntity, `uuid-linkedin-${counter}`),
    gitHubProfile = ref(GitHubProfileEntity, `uuid-github-${counter}`),
  } = overrides;

  return {
    uuid,
    firstName: `First${counter}`,
    lastName: `Last${counter}`,
    title: undefined,
    biography: undefined,
    birthDate: undefined,
    location: undefined,
    contactEmail: undefined,
    contactPhoneNumber: undefined,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    linkedInProfile,
    gitHubProfile,
    ...overrides,
  };
}
