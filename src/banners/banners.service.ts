import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Banner } from 'src/banners/schemas/banner.schema';
import { BannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
    constructor(private bannerModel: Model<Banner>) { }

    async createBanner(bannerDto: BannerDto): Promise<Banner> {
        const createdBanner = new this.bannerModel(bannerDto);
        return createdBanner.save();
    }

    async findAll(): Promise<Banner[]> {
        return this.bannerModel.find().exec();
    }

    async findOne(id: string): Promise<Banner | null> {
        return this.bannerModel.findById(id).exec();
    }

    async remove(id: string): Promise<Banner | null> {
        return this.bannerModel.findByIdAndDelete(id).exec();
    }

    async update(id: string, bannerDto: BannerDto): Promise<Banner | null> {
        return this.bannerModel.findByIdAndUpdate(id, bannerDto, { new: true }).exec();
    }
}
