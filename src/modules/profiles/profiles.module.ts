import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContactMessagesModule } from '@modules/contact-messages/contact-messages.module';
import { GitHubProfilesRepository } from '@modules/profiles/github-profiles.repository';
import { LinkedInProfilesRepository } from '@modules/profiles/linkedin-profiles.repository';
import { ProfilesController } from '@modules/profiles/profiles.controller';
import { ProfilesRepository } from '@modules/profiles/profiles.repository';
import { ProfilesSeeder } from '@modules/profiles/profiles.seeder';
import { ProfilesService } from '@modules/profiles/profiles.service';
import { Module } from '@nestjs/common';
import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package';

@Module({
  controllers: [ProfilesController],
  providers: [
    ProfilesRepository,
    LinkedInProfilesRepository,
    GitHubProfilesRepository,
    ProfilesSeeder,
    ProfilesService,
  ],
  imports: [
    MikroOrmModule.forFeature([
      ProfileEntity,
      LinkedInProfileEntity,
      GitHubProfileEntity,
    ]),
    ContactMessagesModule,
  ],
})
export class ProfilesModule {}
