import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { Subscribe, SubscribeSchema } from './schemas/subscribe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscribe.name, schema: SubscribeSchema },
    ]),
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}

