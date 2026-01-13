import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Cart } from './schemas/cart.schema';
import { CartItemDto, SyncCartDto } from './dto/cart.dto';

@Injectable()
export class CartsService {
    private readonly redis: Redis | null;
    private readonly CACHE_TTL = 3600 * 24;

    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        private readonly redisService: RedisService,
    ) {
        this.redis = this.redisService.getOrThrow();
    }

    private getCartCacheKey(userId: string): string {
        return `cart:${userId}`;
    }

    async getCart(userId: string): Promise<any> {
        const cacheKey = this.getCartCacheKey(userId);

        // Try to get from Redis
        if (this.redis) {
            const cachedCart = await this.redis.get(cacheKey);
            if (cachedCart) {
                return JSON.parse(cachedCart);
            }
        }

        // fallback to MongoDB
        const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) }).populate('items.productId');

        if (cart && this.redis) {
            await this.redis.set(cacheKey, JSON.stringify(cart), 'EX', this.CACHE_TTL);
        }

        return cart || { userId, items: [] };
    }

    async syncCart(userId: string, syncCartDto: SyncCartDto): Promise<any> {
        const { items: localItems } = syncCartDto;
        let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });

        if (!cart) {
            cart = new this.cartModel({
                userId: new Types.ObjectId(userId),
                items: [],
            });
        }

        // Merge items
        for (const localItem of localItems) {
            const existingItemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === localItem.productId,
            );

            if (existingItemIndex > -1) {
                // If exists, use the larger quantity or local quantity? 
                // Typically we add or take the latest. Let's add them.
                cart.items[existingItemIndex].quantity += localItem.quantity;
            } else {
                cart.items.push({
                    productId: new Types.ObjectId(localItem.productId),
                    quantity: localItem.quantity,
                } as any);
            }
        }

        await cart.save();

        // Invalidate/Update cache
        if (this.redis) {
            const populatedCart = await cart.populate('items.productId');
            await this.redis.set(this.getCartCacheKey(userId), JSON.stringify(populatedCart), 'EX', this.CACHE_TTL);
        }

        return cart;
    }

    async updateQuantity(userId: string, productId: string, quantity: number): Promise<any> {
        const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
        if (!cart) throw new NotFoundException('Cart not found');

        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1) throw new NotFoundException('Product not found in cart');

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        if (this.redis) {
            const populatedCart = await cart.populate('items.productId');
            await this.redis.set(this.getCartCacheKey(userId), JSON.stringify(populatedCart), 'EX', this.CACHE_TTL);
        }

        return cart;
    }

    async removeItem(userId: string, productId: string): Promise<any> {
        const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
        if (!cart) throw new NotFoundException('Cart not found');

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId) as any;
        await cart.save();

        if (this.redis) {
            const populatedCart = await cart.populate('items.productId');
            await this.redis.set(this.getCartCacheKey(userId), JSON.stringify(populatedCart), 'EX', this.CACHE_TTL);
        }

        return cart;
    }

    async clearCart(userId: string): Promise<void> {
        await this.cartModel.deleteOne({ userId: new Types.ObjectId(userId) });
        if (this.redis) {
            await this.redis.del(this.getCartCacheKey(userId));
        }
    }
}
