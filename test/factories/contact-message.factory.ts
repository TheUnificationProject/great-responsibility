import { ContactMessageEntity } from 'optimus-package';

let counter = 0;

export function createContactMessageEntity(
  overrides: Partial<ContactMessageEntity> = {},
): ContactMessageEntity {
  counter++;
  return {
    uuid: `uuid-msg-${counter}`,
    profileUuid: `uuid-profile-${counter}`,
    firstName: `John${counter}`,
    lastName: `Doe${counter}`,
    organizationName: null,
    email: `john${counter}@test.com`,
    phoneNumber: null,
    message: `Test message ${counter}`,
    lang: 'fr',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  };
}
