import { DEFAULT_SKILLS } from '@modules/skills/skills.constants';
import { SkillsService } from '@modules/skills/skills.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

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
        const skill = await this.skillsService.createSkill(skillData);
        this.logger.log(
          `Skill "${skill.label}"(${skill.slug}) created successfully`,
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
