import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsMongoId, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBulkCategoriesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  names: string[];
}

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isSpotlight?: boolean;
}

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isSpotlight?: boolean;
}

export class BlogQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSpotlight?: boolean;
}
