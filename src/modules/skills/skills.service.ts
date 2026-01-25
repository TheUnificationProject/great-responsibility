import { SkillsRepository } from '@modules/skills/skills.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { PaginatedResult, Skill, SkillEntity } from 'optimus-package';
import slugify from 'slugify';

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  public async getSkills(
    query: {
      limit?: number;
      page?: number;
    } = {},
  ): Promise<PaginatedResult<SkillEntity>> {
    const { limit, offset } = this.skillsRepository.getPaginationParams(query);

    const [skills, count] = await Promise.all([
      this.skillsRepository.findMany({}, { limit, offset }),
      this.skillsRepository.count(),
    ]);

    return {
      data: skills,
      pagination: {
        page: query.page ?? 1,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  public async createSkill(
    data: Omit<SkillEntity, 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<SkillEntity> {
    const slug = SkillsService.slugifyLabel(data.label);

    const existingSkill = await this.skillsRepository.findOne({ slug });
    if (existingSkill)
      throw new ConflictException(`Skill with slug "${slug}" already exists`);

    const skill = await this.skillsRepository.create({ ...data, slug });

    return skill;
  }

  public static slugifyLabel(label: string): string {
    return slugify(label, { lower: true, strict: true });
  }

  public static formatSkill(skill: SkillEntity): Skill {
    return {
      slug: skill.slug,
      label: skill.label,
      iconUrl: skill.iconUrl,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      deletedAt: skill.deletedAt,
    };
  }
}
