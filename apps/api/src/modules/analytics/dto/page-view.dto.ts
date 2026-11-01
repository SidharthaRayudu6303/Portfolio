import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PageViewDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  device?: string;
}
