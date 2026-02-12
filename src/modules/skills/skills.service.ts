import { ImageExtension, ImageMimeType } from '@/types';
import { FirebaseStorageService } from '@modules/firebase/firebase-storage.service';
import { SkillsRepository } from '@modules/skills/skills.repository';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { slugify } from '@utils/string';
import { inArray, SQL } from 'drizzle-orm';
import {
  PaginatedResult,
  Skill,
  SkillCategory,
  SkillEntity,
  SkillSchema,
  skillSchema,
} from 'optimus-package';
import sharp from 'sharp';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    private readonly skillsRepository: SkillsRepository,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  public async getSkills(
    query: {
      limit?: number;
      page?: number;
      categories?: SkillCategory[];
    } = {},
  ): Promise<PaginatedResult<SkillEntity>> {
    const { limit, offset } = this.skillsRepository.getPaginationParams(query);

    const where: SQL<SkillSchema> | undefined =
      query.categories && query.categories.length > 0
        ? (inArray(skillSchema.category, query.categories) as SQL<SkillSchema>)
        : undefined;

    const [skills, count] = await Promise.all([
      this.skillsRepository.findMany(where, { limit, offset }),
      this.skillsRepository.count(where),
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

  private async uploadSkillIcon(slug: string, buffer: Buffer): Promise<string> {
    const file = await sharp(buffer)
      .resize(256, 256, { fit: 'inside', withoutEnlargement: true })
      .webp({
        quality: 85,
        effort: 4,
      })
      .toBuffer();

    const uploadResult = await this.firebaseStorageService.uploadImage({
      path: 'images/skills/icons',
      file,
      fileName: `${slug}.${ImageExtension.WEBP}`,
      contentType: ImageMimeType.WEBP,
    });

    return uploadResult.url;
  }

  public async createSkill(
    data: Omit<
      SkillEntity,
      'slug' | 'iconUrl' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > &
      (
        | {
            iconUrl: Nullable<string>;
            iconBuffer?: never;
          }
        | { iconUrl?: never; iconBuffer: Buffer }
      ),
  ): Promise<SkillEntity> {
    const slug = slugify(data.label);

    const existingSkill = await this.skillsRepository.findOne({ slug });
    if (existingSkill)
      throw new ConflictException(`Skill with slug "${slug}" already exists`);

    const _data: Partial<SkillEntity> = {
      slug,
      label: data.label,
      category: data.category,
    };

    if ('iconUrl' in data && data.iconUrl) {
      _data.iconUrl = data.iconUrl;
    } else if ('iconBuffer' in data && data.iconBuffer) {
      try {
        _data.iconUrl = await this.uploadSkillIcon(slug, data.iconBuffer);
        this.logger.log(`Icon uploaded for "${data.label}": ${_data.iconUrl}`);
      } catch (uploadError) {
        this.logger.warn(
          `Failed to upload icon for "${data.label}": ${uploadError}`,
        );
      }
    }

    const skill = await this.skillsRepository.create(_data);

    return skill;
  }

  public static formatSkill(skill: SkillEntity): Skill {
    return {
      slug: skill.slug,
      label: skill.label,
      iconUrl: skill.iconUrl,
      category: skill.category,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      deletedAt: skill.deletedAt,
    };
  }
}
