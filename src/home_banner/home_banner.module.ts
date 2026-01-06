import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeBanner, HomeBannerSchema } from './schemas/home_banner.schema';
import { HomeBannerService } from './home_banner.service';
import { HomeBannerController } from './home_banner.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HomeBanner.name, schema: HomeBannerSchema }]),
    CloudinaryModule,
  ],
  providers: [HomeBannerService],
  controllers: [HomeBannerController],
  exports: [HomeBannerService],
})
export class HomeBannerModule {}
