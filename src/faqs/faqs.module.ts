import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from './schemas/faq.schema';

@Module({
  providers: [FaqsService],
  controllers: [FaqsController],
  imports: [MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }])],
})
export class FaqsModule {}
