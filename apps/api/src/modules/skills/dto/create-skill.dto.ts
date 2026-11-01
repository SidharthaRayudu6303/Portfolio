import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  level!: number;

  @IsOptional()
  @IsInt()
  order?: number;
}

