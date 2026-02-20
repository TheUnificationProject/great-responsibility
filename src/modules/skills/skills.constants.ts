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
    iconPath: join(ASSETS_DIR, 'discordjs-original.svg'),
  },
  {
    label: 'Prisma',
    category: 'library',
    iconPath: join(ASSETS_DIR, 'prisma-original.svg'),
  },
  {
    label: 'Drizzle',
    category: 'library',
    iconUrl: null,
  },
  {
    label: 'Mongoose',
    category: 'library',
    iconPath: join(ASSETS_DIR, 'mongoose-original.svg'),
  },

  // Databases
  {
    label: 'PostgreSQL',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'postgresql-original.svg'),
  },
  {
    label: 'MySQL',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'mysql-original.svg'),
  },
  {
    label: 'MariaDB',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'mariadb-original.svg'),
  },
  {
    label: 'MongoDB',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'mongodb-original.svg'),
  },
  {
    label: 'Redis',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'redis-original.svg'),
  },
  {
    label: 'Elasticsearch',
    category: 'database',
    iconPath: join(ASSETS_DIR, 'elasticsearch-original.svg'),
  },

  // Front styling
  {
    label: 'HTML',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'html5-original.svg'),
  },
  {
    label: 'CSS',
    category: 'language',
    iconPath: join(ASSETS_DIR, 'css3-original.svg'),
  },
  {
    label: 'Sass',
    category: 'library',
    iconPath: join(ASSETS_DIR, 'sass-original.svg'),
  },
  {
    label: 'Tailwind CSS',
    category: 'library',
    iconPath: join(ASSETS_DIR, 'tailwindcss-original.svg'),
  },
  {
    label: 'Bootstrap',
    category: 'library',
    iconPath: join(ASSETS_DIR, 'bootstrap-original.svg'),
  },

  // Versioning / Platforms
  {
    label: 'Git',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'git-original.svg'),
  },
  {
    label: 'GitHub',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'github-original.svg'),
  },
  {
    label: 'GitLab',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'gitlab-original.svg'),
  },
  {
    label: 'Bitbucket',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'bitbucket-original.svg'),
  },

  // Testing / Quality
  {
    label: 'ESLint',
    category: 'tool',
    iconPath: join(ASSETS_DIR, 'eslint-original.svg'),
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
] as const;
