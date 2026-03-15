import { EntityDTO } from '@mikro-orm/core';
import { SkillCategory, SkillEntity } from 'optimus-package';
import { join } from 'path';

const ASSETS_DIR = join(process.cwd(), 'assets/skills/icons');

export type SkillSeedData = Omit<
  EntityDTO<SkillEntity>,
  'slug' | 'createdAt' | 'iconUrl' | 'updatedAt' | 'deletedAt'
> &
  (
    | { iconUrl: string; iconPath?: never }
    | { iconPath: string; iconUrl?: never }
    | { iconUrl?: never; iconPath?: never }
  );

export const DEFAULT_SKILLS: SkillSeedData[] = [
  // Languages
  {
    label: 'TypeScript',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'typescript-original.svg'),
  },
  {
    label: 'JavaScript',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'javascript-original.svg'),
  },
  {
    label: 'Java',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'java-original-wordmark.svg'),
  },
  {
    label: 'Python',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'python-original.svg'),
  },
  {
    label: 'PHP',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'php-original.svg'),
  },
  {
    label: 'C',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'c-original.svg'),
  },
  {
    label: 'C#',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'csharp-original.svg'),
  },
  {
    label: 'SQL',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'sql.jpg'),
  },

  // Runtime / Tools
  {
    label: 'Node.js',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'nodejs-original.svg'),
  },
  {
    label: 'Docker',
    category: SkillCategory.DEVOPS,
    iconPath: join(ASSETS_DIR, 'docker-original.svg'),
  },
  {
    label: 'Nginx',
    category: SkillCategory.DEVOPS,
    iconPath: join(ASSETS_DIR, 'nginx-original.svg'),
  },

  // Frameworks
  {
    label: 'React',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'react-original.svg'),
  },
  {
    label: 'Next.js',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'nextjs-original.svg'),
  },
  {
    label: 'NestJS',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'nestjs-original.svg'),
  },
  {
    label: 'Express',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'express-original.svg'),
  },
  {
    label: 'Laravel',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'laravel-original.svg'),
  },
  {
    label: 'Django',
    category: SkillCategory.FRAMEWORK,
    iconPath: join(ASSETS_DIR, 'django-plain-wordmark.svg'),
  },

  // Libraries
  {
    label: 'discord.js',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'discordjs-original.svg'),
  },
  {
    label: 'Prisma',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'prisma-original.svg'),
  },
  {
    label: 'Drizzle',
    category: SkillCategory.LIBRARY,
  },
  {
    label: 'Mongoose',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'mongoose-original.svg'),
  },

  // Databases
  {
    label: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'postgresql-original.svg'),
  },
  {
    label: 'MySQL',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'mysql-original.svg'),
  },
  {
    label: 'MariaDB',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'mariadb-original.svg'),
  },
  {
    label: 'MongoDB',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'mongodb-original.svg'),
  },
  {
    label: 'Redis',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'redis-original.svg'),
  },
  {
    label: 'Elasticsearch',
    category: SkillCategory.DATABASE,
    iconPath: join(ASSETS_DIR, 'elasticsearch-original.svg'),
  },

  // Front styling
  {
    label: 'HTML',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'html5-original.svg'),
  },
  {
    label: 'CSS',
    category: SkillCategory.LANGUAGE,
    iconPath: join(ASSETS_DIR, 'css3-original.svg'),
  },
  {
    label: 'Sass',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'sass-original.svg'),
  },
  {
    label: 'Tailwind CSS',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'tailwindcss-original.svg'),
  },
  {
    label: 'Bootstrap',
    category: SkillCategory.LIBRARY,
    iconPath: join(ASSETS_DIR, 'bootstrap-original.svg'),
  },

  // Versioning / Platforms
  {
    label: 'Git',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'git-original.svg'),
  },
  {
    label: 'GitHub',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'github-original.svg'),
  },
  {
    label: 'GitLab',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'gitlab-original.svg'),
  },
  {
    label: 'Bitbucket',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'bitbucket-original.svg'),
  },

  // Testing / Quality
  {
    label: 'ESLint',
    category: SkillCategory.TOOL,
    iconPath: join(ASSETS_DIR, 'eslint-original.svg'),
  },
  {
    label: 'Prettier',
    category: SkillCategory.TOOL,
  },

  // Cloud / Deploy
  {
    label: 'Vercel',
    category: SkillCategory.CLOUD,
  },

  // Soft skills
  { label: 'Communication', category: SkillCategory.SOFTSKILL },
  { label: 'Rigueur', category: SkillCategory.SOFTSKILL },
  { label: 'Autonomie', category: SkillCategory.SOFTSKILL },
  {
    label: "Esprit d'équipe",
    category: SkillCategory.SOFTSKILL,
  },
] as const;
