import { PaginationQueryParams } from '@modules/generics/generics.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { SkillCategory } from 'optimus-package';
import { CATEGORIES } from 'optimus-package/schemas/skill.schema';

export class GetSkillsQuery extends PaginationQueryParams {
  @IsOptional()
  @IsArray()
  @IsIn(CATEGORIES, { each: true })
  @Transform(({ value }) =>
    value === undefined ? undefined : Array.isArray(value) ? value : [value],
  )
  @ApiPropertyOptional({
    description: 'Filter by skill categories',
    enum: CATEGORIES,
    isArray: true,
    example: ['language', 'framework'],
  })
  categories?: SkillCategory[];
}
