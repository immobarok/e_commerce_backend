import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { System, SystemDocument } from './schemas/system.schema';
import { UpdateSystemDto } from './dto/system.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class SystemService {
  constructor(
    @InjectModel(System.name) private systemModel: Model<SystemDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadGalleryImages(files: Express.Multer.File[]): Promise<System> {
    const imageUrls = await this.cloudinaryService.uploadMultipleImages(files, 'system-gallery');
    
    // We append the new images to the existing gallery
    const system = await this.systemModel
      .findOneAndUpdate(
        {},
        { $push: { gallery: { $each: imageUrls } } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
    return system;
  }

  async getSystem(): Promise<System> {
    const system = await this.systemModel.findOne().exec();
    if (!system) {
      // Return empty defaults if not found
      return {
        gallery: [],
        socialMedia: [],
        deliveryCharge: 0,
        systemName: '',
      } as System;
    }
    return system;
  }

  async getDeliveryCharge(): Promise<number> {
    const system = await this.systemModel.findOne({}, { deliveryCharge: 1 }).exec();
    return system ? system.deliveryCharge : 0;
  }

  async updateSystem(updateSystemDto: UpdateSystemDto): Promise<System> {
    // We only ever want ONE system document. Using upsert: true.
    const system = await this.systemModel
      .findOneAndUpdate({}, updateSystemDto, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();
    return system;
  }
}
