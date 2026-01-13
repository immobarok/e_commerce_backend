import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: { amount: number; userId: string }) {
    return this.stripeService.createCheckoutSession(body.userId, body.amount);
  }
}
