import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './schemas/contact.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  async handleContactMessage(data: CreateContactDto): Promise<Contact> {
    try {
      const newMessage = new this.contactModel(data);
      return await newMessage.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save contact message',
        error.message,
      );
    }
  }
}
