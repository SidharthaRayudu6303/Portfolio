import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUrl,
  IsInt,
} from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  issuer!: string;

  @IsDateString()
  issueDate!: string;

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

