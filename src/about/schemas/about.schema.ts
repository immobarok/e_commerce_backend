import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Hero {
  @Prop({ required: true }) year: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) image: string;
}

@Schema({ _id: false })
class Content {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: false }) quote: string;
  @Prop({ required: true }) image: string;
}

@Schema({ _id: false })
class Principle {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
}

@Schema({ _id: false })
class Studio {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ type: [String], required: true }) images: string[];
}

@Schema({ _id: false })
class Statistics {
  @Prop({ required: true }) value: number;
  @Prop({ required: true }) label: string;
}

@Schema({ timestamps: true })
export class AboutPage extends Document {
  @Prop({ type: Hero, required: true })
  hero: Hero;

  @Prop({ type: Content, required: true })
  content: Content;

  @Prop({ type: [Principle], default: [] })
  principles: Principle[];

  @Prop({ type: Studio, required: true })
  studio: Studio;

  @Prop({ type: [Statistics], default: [] })
  statistics: Statistics[];
}

export const AboutPageSchema = SchemaFactory.createForClass(AboutPage);