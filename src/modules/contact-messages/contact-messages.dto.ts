import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
} from 'optimus-package/schemas/contact-message.schema';

export class SendMessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(FIRST_NAME_MAX_LENGTH)
  @ApiProperty({
    example: 'John',
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LAST_NAME_MAX_LENGTH)
  @ApiProperty({
    example: 'Doe',
  })
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(ORGANIZATION_NAME_MAX_LENGTH)
  @ApiProperty({
    example: 'Acme Corp',
  })
  organizationName?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'contact@email.fr',
  })
  email!: string;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '+1234567890',
  })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Hello, I would like to get in touch with you regarding...',
  })
  message!: string;
}
