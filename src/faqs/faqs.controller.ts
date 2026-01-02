import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateBulkFaqDto } from './dto/faqs.dto';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {

  }

  @Post('create')
  createFaq(@Body() data: CreateBulkFaqDto) {
    return this.faqsService.createBulkFaqs(data.categories);
  }

  @Get('all')
  getAllFaqs() {
    return this.faqsService.getAllFaqs();
  }

  @Get('category/:category')
  getFaqsByCategory(@Param('category') category: string) {
    return this.faqsService.getFaqsByCategory(category);
  }
}
