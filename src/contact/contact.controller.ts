import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactInformationDto, CreateContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  sendMessage(@Body() data: CreateContactDto) {
    return this.contactService.handleContactMessage(data);
  }

  @Get('info')
  getContactInfo() {
    return this.contactService.getContactInformation();
  }

  @Post('info')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateContactInfo(@Body() data: ContactInformationDto) {
    return this.contactService.postContactInformation(data);
  }
}
