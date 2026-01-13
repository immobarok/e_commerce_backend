import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { DisplayReview, DisplayReviewSchema } from './schemas/home.shcma';
import { DealsOfTheWeek, DealsOfTheWeekSchema } from './schemas/dealsOftheWeek.schema';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DisplayReview.name, schema: DisplayReviewSchema },
            { name: DealsOfTheWeek.name, schema: DealsOfTheWeekSchema },
        ]),
        ProductsModule,
        OrdersModule,
    ],
    controllers: [HomeController],
    providers: [HomeService],
    exports: [HomeService],
})
export class HomeModule { }
