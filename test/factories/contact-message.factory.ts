import { ref } from '@mikro-orm/core';
import { ContactMessageEntity, ProfileEntity } from 'optimus-package';

let counter = 0;

export function createContactMessageEntity(
  overrides: Partial<ContactMessageEntity> = {},
): ContactMessageEntity {
  counter++;

  const { profile = ref(ProfileEntity, `uuid-profile-${counter}`) } = overrides;

  return {
    uuid: `uuid-msg-${counter}`,
    profile,
    firstName: `John${counter}`,
    lastName: `Doe${counter}`,
    organizationName: undefined,
    email: `john${counter}@test.com`,
    phoneNumber: undefined,
    message: `Test message ${counter}`,
    lang: 'fr',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}
