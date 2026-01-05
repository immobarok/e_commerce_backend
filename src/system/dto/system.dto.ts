import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// Social Media-r jonno alada ekta class jate validation thik thake
class SocialMediaDto {
  @IsString()
  @IsNotEmpty()
  platform: string; // e.g., 'Facebook', 'Instagram'

  @IsUrl()
  @IsNotEmpty()
  url: string;
}

export class UpdateSystemDto {
  
  // Multiple Gallery Images (Array of strings/URLs)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery: string[];

  // Multiple Social Media Links
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDto)
  socialMedia: SocialMediaDto[];

  // Delivery Charge (Numeric value)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  deliveryCharge: number;

  // System Name ba onno kichu thakle
  @IsOptional()
  @IsString()
  systemName?: string;
}