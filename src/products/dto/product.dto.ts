import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsString()
  @IsOptional()
  colorCode?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountPrice?: number | null;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  bestSelling?: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  topRated?: boolean;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsString()
  @IsOptional()
  colorCode?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountPrice?: number | null;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  bestSelling?: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  topRated?: boolean;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}
