import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lower-case alphanumeric and can contain hyphens (e.g. "my-article")',
  })
  slug!: string;

  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}

