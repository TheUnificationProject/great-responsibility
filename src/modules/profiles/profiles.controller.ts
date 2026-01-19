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
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfiles(@Query() query: GetProfilesQuery) {
    const result = await this.profilesService.getProfiles(query);

    console.log(result);

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
    });
  }

  @Patch(':uuid/linkedin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update LinkedIn profile' })
  async updateLinkedInProfile(
    @Param() params: ProfileParams,
    @Body() data: UpdateLinkedInProfileBody,
  ) {
    await this.profilesService.updateLinkedInProfile(params.uuid, data);
  }

  @Patch(':uuid/github')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: UpdateGitHubProfileBody })
  @ApiOperation({ summary: 'Update GitHub profile' })
  async updateGitHubProfile(
    @Param() params: ProfileParams,
    @Body() data: UpdateGitHubProfileBody,
  ) {
    await this.profilesService.updateGitHubProfile(params.uuid, data);
  }
}
