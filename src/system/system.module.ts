import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { System, SystemSchema } from './schemas/system.schema';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: System.name, schema: SystemSchema }]),
    CloudinaryModule,
  ],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
