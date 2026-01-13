import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisplayReviewDto } from './dto/displayReview.dto';
import { DisplayReview } from './schemas/home.shcma';

@Injectable()
export class HomeService {
    constructor(
        @InjectModel(DisplayReview.name)
        private readonly displayReviewModel: Model<DisplayReview>,
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
}
