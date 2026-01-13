import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BannersService {
    constructor(
        @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async create(createBannerDto: CreateBannerDto, files: Express.Multer.File[]) {
        const existingBanner = await this.bannerModel.findOne({ slug: createBannerDto.slug });
        if (existingBanner) {
            throw new BadRequestException(`Banner with slug "${createBannerDto.slug}" already exists`);
        }

        if (!files || files.length === 0) {
            throw new BadRequestException('At least one image is required');
        }

        const imageUrls = await this.cloudinaryService.uploadMultipleImages(files, 'banners');

        const banner = new this.bannerModel({
            ...createBannerDto,
            images: imageUrls,
        });

        return banner.save();
    }

    async findAll() {
        return this.bannerModel.find().sort({ createdAt: -1 });
    }

    async findOne(id: string) {
        const banner = await this.bannerModel.findById(id);
        if (!banner) throw new NotFoundException('Banner not found');
        return banner;
    }

    async update(id: string, dto: UpdateBannerDto, files?: Express.Multer.File[]) {
        const banner = await this.findOne(id);

        let images = banner.images;

        if (files && files.length > 0) {
            const newImages = await this.cloudinaryService.uploadMultipleImages(files, 'banners');

            for (const img of banner.images) {
                await this.cloudinaryService.deleteImage(img);
            }

            images = newImages;
        }

        return this.bannerModel.findByIdAndUpdate(
            id,
            { ...dto, images },
            { new: true },
        );
    }

    async remove(id: string) {
        const banner = await this.findOne(id);

        for (const img of banner.images) {
            await this.cloudinaryService.deleteImage(img);
        }

        await this.bannerModel.findByIdAndDelete(id);
    }
}
