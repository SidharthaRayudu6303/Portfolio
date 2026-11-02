import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  Matches,
} from 'class-validator';

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lower-case alphanumeric and can contain hyphens (e.g. "my-article")',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}

