import { DEFAULT_SKILLS } from '@modules/skills/skills.constants';
import { SkillsService } from '@modules/skills/skills.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';

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

    const results = await Promise.allSettled(
      DEFAULT_SKILLS.map(async (skillData) => {
        const skill = skillData.iconPath
          ? await this.skillsService.createSkill({
              label: skillData.label,
              category: skillData.category,
              iconBuffer: await readFile(skillData.iconPath),
            })
          : await this.skillsService.createSkill({
              label: skillData.label,
              category: skillData.category,
              iconUrl: skillData.iconUrl || null,
            });

        this.logger.log(
          `Skill "${skill.label}" (${skill.slug}) created successfully`,
        );

        return skill;
      }),
    );

    const failed = results.filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected',
    );

    for (const result of failed) {
      this.logger.error(`Failed to create skill: ${result.reason}`);
    }

    this.logger.log(
      `Skills seeding completed: ${results.length - failed.length}/${results.length} succeeded`,
    );
  }
}
