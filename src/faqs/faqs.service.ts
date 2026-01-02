import { Injectable } from '@nestjs/common';
import { CreateFaqDto, FaqResponseDto } from './dto/faqs.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq } from './schemas/faq.schema';

@Injectable()
export class FaqsService {
  constructor(
    @InjectModel(Faq.name) private faqModel: Model<Faq>,
  ) {}

  async createFaq(data: CreateFaqDto): Promise<FaqResponseDto> {
    const faq = new this.faqModel(data);
    const savedFaq = await faq.save();
    return {
      category: savedFaq.category,
      faqs: savedFaq.faqs,
    };
  }

  async createBulkFaqs(data: CreateFaqDto[]): Promise<FaqResponseDto[]> {
    const savedFaqs = await this.faqModel.insertMany(data);
    return savedFaqs.map((faq) => ({
      category: faq.category,
      faqs: faq.faqs,
    }));
  }

  async getAllFaqs(): Promise<FaqResponseDto[]> {
    const faqs = await this.faqModel.find().exec();
    return faqs.map((faq) => ({
      category: faq.category,
      faqs: faq.faqs,
    }));
  }

  async getFaqsByCategory(category: string): Promise<FaqResponseDto[]> {
    const faqs = await this.faqModel.find({ category }).exec();
    return faqs.map((faq) => ({
      category: faq.category,
      faqs: faq.faqs,
    }));
  }
}
