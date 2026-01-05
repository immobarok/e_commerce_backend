import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscribeDto } from './dto/subscribe.dto';
import { Subscribe, SubscribeDocument } from './schemas/subscribe.schema';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<SubscribeDocument>,
  ) {}

  async subscribe(subscribeDto: SubscribeDto) {
    try {
      const newSubscribe = new this.subscribeModel(subscribeDto);
      return await newSubscribe.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already subscribed');
      }
      throw error;
    }
  }
}
