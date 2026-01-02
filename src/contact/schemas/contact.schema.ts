import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ContactStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: ContactStatus, default: ContactStatus.PENDING })
  status: ContactStatus;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
