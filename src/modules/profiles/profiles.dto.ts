import { PaginationQueryParams } from '@modules/generics/generics.dto';
import {
  DEFAULT_GITHUB_PROFILE_DATA,
  DEFAULT_LINKEDIN_PROFILE_DATA,
  DEFAULT_PROFILE_DATA,
} from '@modules/profiles/profiles.constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  GITHUB_USERNAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  LINKEDIN_SLUG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from 'optimus-package/schemas/profile.schema';

export class GetProfilesQuery extends PaginationQueryParams {}

export class ProfileParams {
  @IsUUID()
  @ApiProperty({
    description: 'The UUID of the profile',
    example: '08532d7c-f50e-4190-9b19-b4e7169dc7cd',
  })
  uuid: string;
}

export class UpdateProfileBody {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(FIRST_NAME_MIN_LENGTH)
  @MaxLength(FIRST_NAME_MAX_LENGTH)
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.firstName,
  })
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(LAST_NAME_MIN_LENGTH)
  @MaxLength(LAST_NAME_MAX_LENGTH)
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.lastName,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(TITLE_MAX_LENGTH)
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.title,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.biography,
  })
  biography?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.birthDate,
  })
  birthDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.location,
  })
  location?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.contactEmail,
  })
  contactEmail?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: DEFAULT_PROFILE_DATA.contactPhoneNumber,
  })
  contactPhoneNumber?: string;
}

export class UpdateLinkedInProfileBody {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(LINKEDIN_SLUG_MAX_LENGTH)
  @ApiProperty({
    example: DEFAULT_LINKEDIN_PROFILE_DATA.slug,
  })
  slug?: string;
}

export class UpdateGitHubProfileBody {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(GITHUB_USERNAME_MAX_LENGTH)
  @ApiProperty({
    example: DEFAULT_GITHUB_PROFILE_DATA.username,
  })
  username?: string;
}
