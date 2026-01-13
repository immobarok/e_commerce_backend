import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisplayReviewDto } from './dto/displayReview.dto';
import { DisplayReview } from './schemas/home.shcma';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';
import { DealsOfTheWeek } from './schemas/dealsOftheWeek.schema';

@Injectable()
export class HomeService {
    constructor(
        @InjectModel(DisplayReview.name)
        private readonly displayReviewModel: Model<DisplayReview>,
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>,
        @InjectModel(DealsOfTheWeek.name)
        private readonly dealsModel: Model<DealsOfTheWeek>,
    ) { }

    async createDisplayReview(
        displayReviewDto: DisplayReviewDto,
    ): Promise<DisplayReview> {
        const createdReview = new this.displayReviewModel(displayReviewDto);
        return createdReview.save();
    }

    async updateDisplayReview(
        id: string,
        displayReviewDto: DisplayReviewDto,
    ): Promise<DisplayReview | null> {
        return this.displayReviewModel
            .findByIdAndUpdate(id, displayReviewDto, { new: true })
            .exec();
    }

    async deleteDisplayReview(id: string): Promise<DisplayReview | null> {
        return this.displayReviewModel.findByIdAndDelete(id).exec();
    }

    async getDisplayReview(id: string): Promise<DisplayReview | null> {
        return this.displayReviewModel.findById(id).exec();
    }

    async getAllDisplayReview(): Promise<DisplayReview[]> {
        return this.displayReviewModel.find().exec();
    }

    async patchDisplayReview(
        id: string,
        displayReviewDto: DisplayReviewDto,
    ): Promise<DisplayReview | null> {
        return this.displayReviewModel
            .findByIdAndUpdate(id, displayReviewDto, { new: true })
            .exec();
    }

    async calculateDealsOfTheWeek(): Promise<DealsOfTheWeek[]> {
        const products = await this.productModel.find({ isActive: true }).exec();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const deals = await Promise.all(
            products.map(async (product) => {
                // 1. Sales Velocity (Orders in last 7 days)
                const salesCount = await this.orderModel.countDocuments({
                    productId: product._id,
                    createdAt: { $gte: sevenDaysAgo },
                });

                // 2. Discount Rate
                const discountPercentage = product.discountPrice
                    ? Math.round(
                        ((product.price - product.discountPrice) / product.price) * 100,
                    )
                    : 0;

                // 3. Inventory Score (Simple threshold for this example)
                const inventoryScore = product.stock > 10 ? 1 : 0.5;

                // Weighted Ranking Formula
                // (Sales * 0.5) + (Discount * 0.4) + (Inventory * 0.1)
                const score = salesCount * 0.5 + discountPercentage * 0.4 + inventoryScore * 0.1;

                return {
                    product,
                    score,
                    discountPercentage,
                };
            }),
        );

        // Sort by score and take top 10
        const topDeals = deals
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .filter((d) => d.score > 0);

        // Clear old deals and save new ones
        await this.dealsModel.deleteMany({});

        const savedDeals = await Promise.all(
            topDeals.map((d) => {
                const dealData = {
                    productId: d.product._id,
                    title: d.product.productName,
                    description: d.product.shortDescription || d.product.description,
                    image: d.product.images[0] || '',
                    price: d.product.price,
                    discountPrice: d.product.discountPrice || d.product.price,
                    discountPercentage: d.discountPercentage,
                    stock: d.product.stock,
                };
                return new this.dealsModel(dealData).save();
            }),
        );

        return savedDeals;
    }

    async getDealsOfTheWeek(): Promise<DealsOfTheWeek[]> {
        return this.dealsModel.find().exec();
    }
}
