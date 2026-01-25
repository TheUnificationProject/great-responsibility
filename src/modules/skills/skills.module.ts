import { DatabaseModule } from '@modules/database/database.module';
import { SkillsController } from '@modules/skills/skills.controller';
import { SkillsRepository } from '@modules/skills/skills.repository';
import { SkillsSeeder } from '@modules/skills/skills.seeder';
import { SkillsService } from '@modules/skills/skills.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SkillsController],
  providers: [SkillsRepository, SkillsSeeder, SkillsService],
  imports: [DatabaseModule],
})
export class SkillsModule {}
