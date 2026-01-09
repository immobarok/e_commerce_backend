import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'general', maxSizeInMB: number = 5): Promise<string> {
    // Validate file size (defense in depth)
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(
        `File "${file.originalname}" exceeds maximum size of ${maxSizeInMB}MB (actual: ${fileSizeInMB}MB)`
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) {
            return reject(
              new Error('Cloudinary upload failed: secure_url is missing'),
            );
          }
          resolve(result.secure_url);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'general'): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const publicId = this.extractPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  private extractPublicId(imageUrl: string): string {
    // Extract public ID from URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.jpg
    const parts = imageUrl.split('/');
    const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/');
    return folderAndFile.split('.')[0];
  }
}
