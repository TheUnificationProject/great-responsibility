import { SendMessageBody } from '@modules/contact-messages/contact-messages.dto';
import { ContactMessagesService } from '@modules/contact-messages/contact-messages.service';
import {
  GetProfilesQuery,
  ProfileParams,
  UpdateGitHubProfileBody,
  UpdateLinkedInProfileBody,
  UpdateProfileBody,
} from '@modules/profiles/profiles.dto';
import { ProfilesService } from '@modules/profiles/profiles.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly contactMessagesService: ContactMessagesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfiles(@Query() query: GetProfilesQuery) {
    const result = await this.profilesService.getProfiles(query);

    return {
      profiles: result.data.map((profile) =>
        this.profilesService.formatProfile(profile),
      ),
      pagination: result.pagination,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update profile' })
  async updateProfile(
    @Param() params: ProfileParams,
    @Body() data: UpdateProfileBody,
  ) {
    await this.profilesService.updateProfile(params.uuid, {
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      biography: data.biography,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      location: data.location,
      contactEmail: data.contactEmail,
      contactPhoneNumber: data.contactPhoneNumber,
    });
  }

  @Patch(':uuid/linkedin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update LinkedIn profile' })
  async updateLinkedInProfile(
    @Param() params: ProfileParams,
    @Body() data: UpdateLinkedInProfileBody,
  ) {
    await this.profilesService.updateLinkedInProfile(params.uuid, {
      slug: data.slug,
    });
  }

  @Patch(':uuid/github')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: UpdateGitHubProfileBody })
  @ApiOperation({ summary: 'Update GitHub profile' })
  async updateGitHubProfile(
    @Param() params: ProfileParams,
    @Body() data: UpdateGitHubProfileBody,
  ) {
    await this.profilesService.updateGitHubProfile(params.uuid, {
      username: data.username,
    });
  }

  @Post(':uuid/contact-messages')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Send contact message to profile owner' })
  async sendContactMessage(
    @Param() params: ProfileParams,
    @Body() data: SendMessageBody,
    @Req() req: Request,
  ) {
    const lang =
      (req.headers['accept-language'] as Optional<string>)?.split(',')[0] ||
      null;

    console.log('lang', lang);

    await this.contactMessagesService.createContactMessage({
      profileUuid: params.uuid,
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organizationName || null,
      email: data.email,
      phoneNumber: data.phoneNumber || null,
      message: data.message,
    });
  }
}
