import { SkillEntity } from 'optimus-package';
import { join } from 'path';

// Local icon paths for seeding
// From dist/src/modules/skills/ we need to go up 3 levels to dist/, then to assets/
const ASSETS_DIR = join(process.cwd(), 'src/assets/skills/icons');

export const SKILL_ICONS = {
  typescript: join(ASSETS_DIR, 'typescript-original.svg'),
  javascript: join(ASSETS_DIR, 'javascript-original.svg'),
  java: join(ASSETS_DIR, 'java-original-wordmark.svg'),
  python: join(ASSETS_DIR, 'python-original.svg'),
};

// Extended type for seeding with local icon paths
export type SkillSeedData = Omit<
  SkillEntity,
  'slug' | 'createdAt' | 'iconUrl' | 'updatedAt' | 'deletedAt'
> &
  (
    | { iconUrl: SkillEntity['iconUrl']; iconPath?: never }
    | { iconPath: string; iconUrl?: never }
  );

export const DEFAULT_SKILLS: SkillSeedData[] = [
  // Languages
  {
    label: 'TypeScript',
    category: 'language',
    iconPath: SKILL_ICONS.typescript,
  },
  {
    label: 'JavaScript',
    category: 'language',
    iconPath: SKILL_ICONS.javascript,
  },
  {
    label: 'Java',
    category: 'language',
    iconPath: SKILL_ICONS.java,
  },
  {
    label: 'Python',
    category: 'language',
    iconPath: SKILL_ICONS.python,
  },
  {
    label: 'PHP',
    category: 'language',
    iconUrl: null,
  },
  {
    label: 'C',
    category: 'language',
    iconUrl: null,
  },
  {
    label: 'C#',
    category: 'language',
    iconUrl: null,
  },
  {
    label: 'SQL',
    category: 'language',
    iconUrl: null,
  },

  // Runtime / Tools
  {
    label: 'Node.js',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'Docker',
    category: 'devops',
    iconUrl: null,
  },
  {
    label: 'Linux',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'Nginx',
    category: 'devops',
    iconUrl: null,
  },

  // Frameworks
  {
    label: 'React',
    category: 'framework',
    iconUrl: null,
  },
  {
    label: 'Next.js',
    category: 'framework',
    iconUrl: null,
  },
  {
    label: 'NestJS',
    category: 'framework',
    iconUrl: null,
  },
  {
    label: 'Express',
    category: 'framework',
    iconUrl: null,
  },
  {
    label: 'Laravel',
    category: 'framework',
    iconUrl: null,
  },

  // Libraries
  {
    label: 'discord.js',
    category: 'library',
    iconUrl: null,
  },
  {
    label: 'Prisma',
    category: 'library',
    iconUrl: null,
  },
  {
    label: 'GraphQL',
    category: 'library',
    iconUrl: null,
  },

  // Databases
  {
    label: 'PostgreSQL',
    category: 'database',
    iconUrl: null,
  },
  {
    label: 'MySQL',
    category: 'database',
    iconUrl: null,
  },
  {
    label: 'MariaDB',
    category: 'database',
    iconUrl: null,
  },
  {
    label: 'MongoDB',
    category: 'database',
    iconUrl: null,
  },
  {
    label: 'Redis',
    category: 'database',
    iconUrl: null,
  },

  // Front styling
  {
    label: 'HTML',
    category: 'language',
    iconUrl: null,
  },
  {
    label: 'CSS',
    category: 'language',
    iconUrl: null,
  },
  {
    label: 'Sass',
    category: 'library',
    iconUrl: null,
  },
  {
    label: 'Tailwind CSS',
    category: 'library',
    iconUrl: null,
  },
  {
    label: 'Bootstrap',
    category: 'library',
    iconUrl: null,
  },

  // Versioning / Platforms
  {
    label: 'Git',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'GitHub',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'GitLab',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'Bitbucket',
    category: 'tool',
    iconUrl: null,
  },

  // Testing / Quality
  {
    label: 'Jest',
    category: 'testing',
    iconUrl: null,
  },
  {
    label: 'Cypress',
    category: 'testing',
    iconUrl: null,
  },
  {
    label: 'Playwright',
    category: 'testing',
    iconUrl: null,
  },
  {
    label: 'ESLint',
    category: 'tool',
    iconUrl: null,
  },
  {
    label: 'Prettier',
    category: 'tool',
    iconUrl: null,
  },

  // Cloud / Deploy
  {
    label: 'Vercel',
    category: 'cloud',
    iconUrl: null,
  },
  {
    label: 'Netlify',
    category: 'cloud',
    iconUrl: null,
  },

  // Soft skills
  { label: 'Communication', category: 'softskill', iconUrl: null },
  { label: 'Rigueur', category: 'softskill', iconUrl: null },
  { label: 'Autonomie', category: 'softskill', iconUrl: null },
  { label: "Esprit d'équipe", category: 'softskill', iconUrl: null },
];
