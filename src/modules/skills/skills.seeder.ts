import { DEFAULT_SKILLS } from '@modules/skills/skills.constants';
import { SkillsService } from '@modules/skills/skills.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { SkillEntity } from 'optimus-package';

@Injectable()
export class SkillsSeeder implements OnModuleInit {
  private readonly logger = new Logger(SkillsSeeder.name);

  constructor(private readonly skillsService: SkillsService) {}

  async onModuleInit() {
    const skills = await this.skillsService.getSkills({ limit: 1 });

    if (skills.pagination.totalItems > 0) {
      this.logger.log('Skills already exist, skipping seed');
      return;
    }

    for (const skillData of DEFAULT_SKILLS) {
      try {
        let promise: Promise<SkillEntity>;

        if (skillData.iconPath) {
          const iconPath = skillData.iconPath;

          const iconBuffer = await readFile(iconPath);

          promise = this.skillsService.createSkill({
            label: skillData.label,
            category: skillData.category,
            iconBuffer,
          });
        } else {
          promise = this.skillsService.createSkill({
            label: skillData.label,
            category: skillData.category,
            iconUrl: skillData.iconUrl || null,
          });
        }

        const skill = await promise;

        this.logger.log(
          `Skill "${skill.label}" (${skill.slug}) created successfully`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to create skill "${skillData.label}": ${error}`,
        );
      }
    }

    this.logger.log('Skills seeding completed');
  }
}
