import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  timeToRead?: string;

  @IsOptional()
  @IsDateString()
  postedDate?: string; // must be 2025-12-12
}
