import { FirebaseModule } from '@modules/firebase/firebase.module';
import { SkillsController } from '@modules/skills/skills.controller';
import { SkillsRepository } from '@modules/skills/skills.repository';
import { SkillsSeeder } from '@modules/skills/skills.seeder';
import { SkillsService } from '@modules/skills/skills.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SkillsController],
  providers: [SkillsRepository, SkillsSeeder, SkillsService],
  imports: [FirebaseModule],
})
export class SkillsModule {}
