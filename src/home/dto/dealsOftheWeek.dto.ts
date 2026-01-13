import { IsNotEmpty, IsString, IsNumber, Min, Max, IsUrl, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class DealsOftheWeekDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  discountPrice: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsNotEmpty()
  discountPercentage: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  stock: number;
}