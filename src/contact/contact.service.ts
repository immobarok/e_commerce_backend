import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ContactInformationDto, CreateContactDto } from './dto/contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './schemas/contact.schema';
import { Model } from 'mongoose';
import { ContactInformation } from './schemas/contact-info.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(ContactInformation.name)
    private contactInfoModel: Model<ContactInformation>,
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

  async getContactInformation(): Promise<ContactInformation> {
    try {
      const info = await this.contactInfoModel.findOne().exec();
      if (!info) {
        throw new NotFoundException('Contact information not found');
      }
      return info;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch contact information',
        error.message,
      );
    }
  }

  async postContactInformation(
    data: ContactInformationDto,
  ): Promise<ContactInformation> {
    try {
      return await this.contactInfoModel.findOneAndUpdate({}, data, {
        upsert: true,
        new: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update contact information',
        error.message,
      );
    }
  }
}
