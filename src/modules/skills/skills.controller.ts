import { GetSkillsQuery } from '@modules/skills/skills.dto';
import { SkillsService } from '@modules/skills/skills.service';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSkills(@Query() query: GetSkillsQuery) {
    const result = await this.skillsService.getSkills(query);

    return {
      skills: result.data.map((skill) => SkillsService.formatSkill(skill)),
      pagination: result.pagination,
    };
  }
}
