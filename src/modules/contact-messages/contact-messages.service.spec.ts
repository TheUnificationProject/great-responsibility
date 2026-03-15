import { createContactMessageEntity } from '@factories/contact-message.factory';
import { Test } from '@nestjs/testing';
import { ContactMessagesRepository } from './contact-messages.repository';
import { ContactMessagesService } from './contact-messages.service';

describe('ContactMessagesService', () => {
  let service: ContactMessagesService;
  let repository: jest.Mocked<ContactMessagesRepository>;
  let mockFlush: jest.Mock;
  let mockPersist: jest.Mock;

  beforeEach(async () => {
    mockFlush = jest.fn().mockResolvedValue(undefined);
    mockPersist = jest.fn().mockReturnValue({ flush: mockFlush });

    const module = await Test.createTestingModule({
      providers: [
        ContactMessagesService,
        {
          provide: ContactMessagesRepository,
          useValue: {
            create: jest.fn(),
            getEntityManager: jest
              .fn()
              .mockReturnValue({ persist: mockPersist }),
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
        profile: 'p-1',
        firstName: 'Jane',
        lastName: 'Doe',
        organizationName: 'Acme',
        email: 'jane@test.com',
        phoneNumber: '+33612345678',
        message: 'Hello!',
        lang: 'en',
      };
      const createdMessage = createContactMessageEntity(messageData);
      repository.create.mockReturnValue(createdMessage as never);

      const result = await service.createContactMessage(messageData as never);

      expect(result).toEqual(createdMessage);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@test.com',
          message: 'Hello!',
        }),
      );
      expect(mockPersist).toHaveBeenCalledWith(createdMessage);
      expect(mockFlush).toHaveBeenCalled();
    });

    it('should create a message without optional fields', async () => {
      const messageData = {
        profile: 'p-1',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: undefined,
        email: 'john@test.com',
        phoneNumber: undefined,
        message: 'Hi there',
        lang: 'fr',
      };
      const createdMessage = createContactMessageEntity(messageData);
      repository.create.mockReturnValue(createdMessage as never);

      const result = await service.createContactMessage(messageData as never);

      expect(result.organizationName).toBeUndefined();
      expect(result.phoneNumber).toBeUndefined();
    });
  });
});
