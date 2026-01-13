import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartsService } from './carts.service';
import { SyncCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    async getCart(@Req() req) {
        return this.cartsService.getCart(req.user.userId);
    }

    @Post('sync')
    async syncCart(@Req() req, @Body() syncCartDto: SyncCartDto) {
        return this.cartsService.syncCart(req.user.userId, syncCartDto);
    }

    @Patch(':productId')
    async updateQuantity(
        @Req() req,
        @Param('productId') productId: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartsService.updateQuantity(req.user.userId, productId, updateCartItemDto.quantity);
    }

    @Delete(':productId')
    async removeItem(@Req() req, @Param('productId') productId: string) {
        return this.cartsService.removeItem(req.user.userId, productId);
    }

    @Delete()
    async clearCart(@Req() req) {
        return this.cartsService.clearCart(req.user.userId);
    }
}
