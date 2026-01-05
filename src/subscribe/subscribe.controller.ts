import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    const data = await this.subscribeService.subscribe(subscribeDto);
    return {
      success: true,
      message: 'Subscribed successfully',
      data,
    };
  }
}
