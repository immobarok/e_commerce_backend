import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Hero {
  @Prop() year: string;
  @Prop() title: string;
  @Prop() description: string;
  @Prop() image: string;
}

@Schema()
export class AboutPage extends Document {
  @Prop({ type: Hero })
  hero: Hero;

  @Prop({ type: Object })
  content: { title: string; description: string; quote: string; image: string };

  @Prop({ type: [{ title: String, description: String }] })
  principles: { title: string; description: string }[];

  @Prop({ type: Object })
  studio: { title: string; description: string; images: string[] };

  @Prop({ type: [{ value: Number, label: String }] })
  statistics: { value: number; label: string }[];
}

export const AboutPageSchema = SchemaFactory.createForClass(AboutPage);