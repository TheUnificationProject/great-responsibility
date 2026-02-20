import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package';

let counter = 0;

export function createLinkedInProfileEntity(
  overrides: Partial<LinkedInProfileEntity> = {},
): LinkedInProfileEntity {
  counter++;
  return {
    uuid: `uuid-linkedin-${counter}`,
    profileUuid: `uuid-profile-${counter}`,
    slug: null,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function createGitHubProfileEntity(
  overrides: Partial<GitHubProfileEntity> = {},
): GitHubProfileEntity {
  counter++;
  return {
    uuid: `uuid-github-${counter}`,
    profileUuid: `uuid-profile-${counter}`,
    username: null,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function createProfileEntity(
  overrides: Partial<ProfileEntity> = {},
): ProfileEntity {
  counter++;
  const uuid = overrides.uuid ?? `uuid-profile-${counter}`;
  return {
    uuid,
    firstName: `First${counter}`,
    lastName: `Last${counter}`,
    title: null,
    biography: null,
    birthDate: null,
    location: null,
    contactEmail: null,
    contactPhoneNumber: null,
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    linkedIn: createLinkedInProfileEntity({ profileUuid: uuid }),
    gitHub: createGitHubProfileEntity({ profileUuid: uuid }),
    ...overrides,
  };
}
