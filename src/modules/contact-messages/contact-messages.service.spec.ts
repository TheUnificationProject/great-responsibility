import { createContactMessageEntity } from '@factories/contact-message.factory';
import { Test } from '@nestjs/testing';
import { ContactMessagesRepository } from './contact-messages.repository';
import { ContactMessagesService } from './contact-messages.service';

describe('ContactMessagesService', () => {
  let service: ContactMessagesService;
  let repository: jest.Mocked<ContactMessagesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContactMessagesService,
        {
          provide: ContactMessagesRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ContactMessagesService);
    repository = module.get(ContactMessagesRepository);
  });

  describe('createContactMessage', () => {
    it('should create and return a contact message', async () => {
      const messageData = {
        profileUuid: 'p-1',
        firstName: 'Jane',
        lastName: 'Doe',
        organizationName: 'Acme',
        email: 'jane@test.com',
        phoneNumber: '+33612345678',
        message: 'Hello!',
        lang: 'en',
      };
      const createdMessage = createContactMessageEntity(messageData);
      repository.create.mockResolvedValue(createdMessage);

      const result = await service.createContactMessage(messageData);

      expect(result).toEqual(createdMessage);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@test.com',
          message: 'Hello!',
        }),
      );
    });

    it('should create a message without optional fields', async () => {
      const messageData = {
        profileUuid: 'p-1',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: null,
        email: 'john@test.com',
        phoneNumber: null,
        message: 'Hi there',
        lang: 'fr',
      };
      const createdMessage = createContactMessageEntity(messageData);
      repository.create.mockResolvedValue(createdMessage);

      const result = await service.createContactMessage(messageData);

      expect(result.organizationName).toBeNull();
      expect(result.phoneNumber).toBeNull();
    });
  });
});
