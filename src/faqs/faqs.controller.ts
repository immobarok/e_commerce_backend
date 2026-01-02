import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/faqs.dto';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {

  }

  @Post()
  createFaq(@Body() data: CreateFaqDto) {
    return this.faqsService.createFaq(data);
  }

  @Get()
  getAllFaqs() {
    return this.faqsService.getAllFaqs();
  }

  @Get(':category')
  getFaqsByCategory(@Param('category') category: string) {
    return this.faqsService.getFaqsByCategory(category);
  }
}
