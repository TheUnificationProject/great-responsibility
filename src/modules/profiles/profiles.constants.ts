import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package';

export const DEFAULT_PROFILE_DATA: Omit<
  Partial<ProfileEntity>,
  'uuid' | 'updatedAt'
> = {
  firstName: 'John',
  lastName: 'Doe',
  title: 'Professional dwarves thrower',
  biography:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pellentesque, diam eget bibendum hendrerit, mi ante tristique nunc, ut gravida diam nunc sit amet ante. Integer non egestas diam. Aenean eu pellentesque purus. Morbi id accumsan sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur quis laoreet enim. Nulla ligula diam, varius vitae mauris eu, condimentum tempus nibh. Cras elementum elementum ipsum, sed fringilla dui consectetur vehicula.',
  birthDate: new Date('2000-01-01'),
  location: 'Paris, France',
  contactEmail: 'john.doe@example.com',
};

export const DEFAULT_LINKEDIN_PROFILE_DATA: Partial<LinkedInProfileEntity> = {
  slug: 'john-doe',
};

export const DEFAULT_GITHUB_PROFILE_DATA: Partial<GitHubProfileEntity> = {
  username: 'torvalds',
};
