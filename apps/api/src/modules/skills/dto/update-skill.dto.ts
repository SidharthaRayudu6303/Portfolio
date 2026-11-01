import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  level?: number;

  @IsOptional()
  @IsInt()
  order?: number;
}

