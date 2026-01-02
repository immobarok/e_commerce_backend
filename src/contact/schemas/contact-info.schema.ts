import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactInformation extends Document {
  @Prop({ type: [String] })
  email: string[];

  @Prop()
  phoneNumber: string;
  
  @Prop()
  address: string;

  @Prop()
  businessHours: string;
}

export const ContactInformationSchema =
  SchemaFactory.createForClass(ContactInformation);
