import {
  IsString,
  IsDateString,
  IsOptional,
  IsUrl,
  IsInt,
} from 'class-validator';

export class UpdateCertificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

