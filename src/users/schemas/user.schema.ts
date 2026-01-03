import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
