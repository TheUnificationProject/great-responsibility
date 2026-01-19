import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package';

export const DEFAULT_PROFILE_DATA: Partial<ProfileEntity> = {
  firstName: 'Clément',
  lastName: 'Fossorier',
  title: 'Full Stack Developer | Computer Science Student @ETNA',
  biography:
    'I am a full stack developer with a passion for building web applications. I am currently a computer science student at ETNA.',
  birthDate: new Date('2003-12-04'),
  location: 'Région parisienne, France',
  contactEmail: 'clement.fossorier@gmail.com',
};

export const DEFAULT_LINKEDIN_PROFILE_DATA: Partial<LinkedInProfileEntity> = {
  slug: 'clement-fossorier',
};

export const DEFAULT_GITHUB_PROFILE_DATA: Partial<GitHubProfileEntity> = {
  username: 'FiestaTheNewbieDev',
};
