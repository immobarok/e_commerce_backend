import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schemas/contact.schema';
import {
  ContactInformation,
  ContactInformationSchema,
} from './schemas/contact-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: ContactInformation.name, schema: ContactInformationSchema },
    ]),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
