import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { DisplayReview, DisplayReviewSchema } from './schemas/home.shcma';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DisplayReview.name, schema: DisplayReviewSchema },
        ]),
    ],
    controllers: [HomeController],
    providers: [HomeService],
    exports: [HomeService],
})
export class HomeModule { }
