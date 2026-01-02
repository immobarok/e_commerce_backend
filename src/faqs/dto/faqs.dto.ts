import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsNotEmpty()
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export class CreateBulkFaqDto {
  @IsArray()
  @IsNotEmpty()
  categories: CreateFaqDto[];
}

export class FaqResponseDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsNotEmpty()
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}
