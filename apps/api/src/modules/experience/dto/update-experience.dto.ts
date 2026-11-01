import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}

