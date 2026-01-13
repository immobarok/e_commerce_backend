import { IsArray, IsInt, IsMongoId, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class SyncCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}

export class UpdateCartItemDto {
    @IsInt()
    @Min(1)
    quantity: number;
}
