import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HomeBanner, HomeBannerDocument } from './schemas/home_banner.schema';
import { Model } from 'mongoose';
import { HomeBannerDto } from './dto/homebanner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class HomeBannerService {
  constructor(
    @InjectModel(HomeBanner.name) private homeBannerModel: Model<HomeBannerDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadBannerImage(file: Express.Multer.File): Promise<string> {
    return this.cloudinaryService.uploadImage(file, 'home-banners');
  }

  async createHomeBanner(data: HomeBannerDto): Promise<HomeBanner> {
    const homeBanner = new this.homeBannerModel(data);
    return homeBanner.save();
  }

  async findAll(): Promise<HomeBanner[]> {
    return this.homeBannerModel.find().exec();
  }

  async findOne(id: string): Promise<HomeBanner> {
    const banner = await this.homeBannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: string, data: HomeBannerDto): Promise<HomeBanner> {
    const banner = await this.homeBannerModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async delete(id: string): Promise<HomeBanner> {
    const banner = await this.homeBannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    
    // Delete image from Cloudinary if it exists
    if (banner.image) {
      await this.cloudinaryService.deleteImage(banner.image);
    }
    
    const deletedBanner = await this.homeBannerModel.findByIdAndDelete(id).exec();
    return deletedBanner as HomeBanner;
  }
}


