import { FirebaseStorageService } from '@modules/firebase/firebase-storage.service';
import { SkillsRepository } from '@modules/skills/skills.repository';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { getMimeTypeFromExtension } from '@utils/image';
import { slugify } from '@utils/string';
import { PaginatedResult, Skill, SkillEntity } from 'optimus-package';

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

  private async uploadSkillIcon(
    slug: string,
    file: Buffer,
    fileExtension: string,
  ): Promise<string> {
    const contentType = getMimeTypeFromExtension(fileExtension);
    if (!contentType)
      throw new Error(`Unsupported image extension: ${fileExtension}`);

    const uploadResult = await this.firebaseStorageService.uploadImage({
      path: 'images/skills/icons',
      file,
      fileName: `${slug}.${fileExtension}`,
      contentType,
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
            iconFile?: never;
            iconFileExtension?: never;
          }
        | { iconUrl?: never; iconFile: Buffer; iconFileExtension: string }
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
    } else if ('iconFile' in data && data.iconFile) {
      try {
        _data.iconUrl = await this.uploadSkillIcon(
          slug,
          data.iconFile,
          data.iconFileExtension,
        );
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
