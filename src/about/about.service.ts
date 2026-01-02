import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboutPage } from './schemas/about.schema';
import { UpdateAboutPageDto, PartialUpdateAboutPageDto } from './dto/about.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(AboutPage.name) private aboutPageModel: Model<AboutPage>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAboutPage(): Promise<AboutPage> {
    const aboutPage = await this.aboutPageModel.findOne().exec();
    if (!aboutPage) {
      throw new Error('About page not found');
    }
    return aboutPage;
  }   

  // This handles POST (Full Overwrite/Initialization)
  async saveAboutPage(
    data: UpdateAboutPageDto, 
    files?: { heroImage?: Express.Multer.File[], contentImage?: Express.Multer.File[], studioImages?: Express.Multer.File[] }
  ): Promise<AboutPage> {
    const updateData: any = { ...data };

    if (files) {
      if (files.heroImage?.[0]) {
        updateData.hero.image = await this.cloudinaryService.uploadImage(files.heroImage[0], 'about');
      }
      if (files.contentImage?.[0]) {
        updateData.content.image = await this.cloudinaryService.uploadImage(files.contentImage[0], 'about');
      }
      if (files.studioImages?.length) {
        updateData.studio.images = await this.cloudinaryService.uploadMultipleImages(files.studioImages, 'about');
      }
    }

    return this.aboutPageModel.findOneAndUpdate(
      {}, 
      updateData, 
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    ).exec();
  }

  // This handles PATCH (Partial Update)
  async partialUpdateAboutPage(
    data: PartialUpdateAboutPageDto, 
    files?: { heroImage?: Express.Multer.File[], contentImage?: Express.Multer.File[], studioImages?: Express.Multer.File[] }
  ): Promise<AboutPage> {
    const existingPage = await this.aboutPageModel.findOne().exec();
    const updateData: any = { ...data };

    if (files) {
      if (files.heroImage?.[0]) {
        if (!updateData.hero) updateData.hero = existingPage?.hero || {};
        updateData.hero.image = await this.cloudinaryService.uploadImage(files.heroImage[0], 'about');
      }
      if (files.contentImage?.[0]) {
        if (!updateData.content) updateData.content = existingPage?.content || {};
        updateData.content.image = await this.cloudinaryService.uploadImage(files.contentImage[0], 'about');
      }
      if (files.studioImages?.length) {
        if (!updateData.studio) updateData.studio = existingPage?.studio || { images: [] };
        const newImages = await this.cloudinaryService.uploadMultipleImages(files.studioImages, 'about');
        // If it's a partial update, we might want to append or replace. 
        // For simplicity, let's append if studio.images exists in updateData, or replace if not.
        updateData.studio.images = [...(updateData.studio.images || existingPage?.studio?.images || []), ...newImages];
      }
    }

    return this.aboutPageModel.findOneAndUpdate(
      {}, 
      { $set: updateData }, // Only update provided fields
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    ).exec();
  }
}
