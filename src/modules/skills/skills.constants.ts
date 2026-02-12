import { SkillEntity } from 'optimus-package';
import { join } from 'path';

const ASSETS_DIR = join(process.cwd(), 'assets/skills/icons');

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
    iconPath: join(ASSETS_DIR, 'typescript-original.svg'),
  },
  {
    label: 'JavaScript',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'javascript-original.svg'),
  },
  {
    label: 'Java',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'java-original-wordmark.svg'),
  },
  {
    label: 'Python',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'python-original.svg'),
  },
  {
    label: 'PHP',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'php-original.svg'),
  },
  {
    label: 'C',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'c-original.svg'),
  },
  {
    label: 'C#',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'csharp-original.svg'),
  },
  {
    label: 'SQL',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'sql.jpg'),
  },

  // Runtime / Tools
  {
    label: 'Node.js',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'nodejs-original.svg'),
  },
  {
    label: 'Docker',
    category: 'devops',
    iconPath: join(ASSETS_DIR, 'docker-original.svg'),
  },
  {
    label: 'Nginx',
    category: 'devops',
    iconPath: join(ASSETS_DIR, 'nginx-original.svg'),
  },

  // Frameworks
  {
    label: 'React',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'react-original.svg'),
  },
  {
    label: 'Next.js',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'nextjs-original.svg'),
  },
  {
    label: 'NestJS',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'nestjs-original.svg'),
  },
  {
    label: 'Express',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'express-original.svg'),
  },
  {
    label: 'Laravel',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'laravel-original.svg'),
  },
  {
    label: 'Django',
    category: 'framework',
    iconPath: join(ASSETS_DIR, 'django-plain-wordmark.svg'),
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
  {
    label: 'Elasticsearch',
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

  // Soft skills
  { label: 'Communication', category: 'softskill', iconUrl: null },
  { label: 'Rigueur', category: 'softskill', iconUrl: null },
  { label: 'Autonomie', category: 'softskill', iconUrl: null },
  { label: "Esprit d'équipe", category: 'softskill', iconUrl: null },
];
