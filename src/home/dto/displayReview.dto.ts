import {
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DisplayReviewDto {
  @IsString()
  @IsNotEmpty()
  reviewerName: string;

  @IsNumber()
  @IsOptional()
  rating: number = 5;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date = new Date();
}
