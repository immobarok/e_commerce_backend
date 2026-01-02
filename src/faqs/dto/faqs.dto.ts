import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class FaqResponseDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsOptional()
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}
