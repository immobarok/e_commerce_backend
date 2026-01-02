import { IsString, IsArray, IsNumber, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AboutHeroDto {
  @IsString() @IsNotEmpty()
  year: string;

  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsString() @IsNotEmpty()
  image: string; 
}

export class AboutContentDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsString() @IsOptional()
  quote: string; 

  @IsString() @IsNotEmpty()
  image: string; 
}

export class PrincipleDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  description: string;
}

export class StudioDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}

export class StatisticsDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString() @IsNotEmpty()
  label: string;
}

export class UpdateAboutPageDto {
  @ValidateNested()
  @Type(() => AboutHeroDto)
  @IsNotEmpty()
  hero: AboutHeroDto;

  @ValidateNested()
  @Type(() => AboutContentDto)
  @IsNotEmpty()
  content: AboutContentDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrincipleDto)
  principles: PrincipleDto[];

  @ValidateNested()
  @Type(() => StudioDto)
  @IsNotEmpty()
  studio: StudioDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticsDto)
  statistics: StatisticsDto[];
}