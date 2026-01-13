import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { DisplayReviewDto } from './dto/displayReview.dto';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Post("add-review")
    async createDisplayReview(@Body() displayReviewDto: DisplayReviewDto) {
        return this.homeService.createDisplayReview(displayReviewDto);
    }

    @Get("all-review")
    async getAllDisplayReview() {
        return this.homeService.getAllDisplayReview();
    }

    @Get("review/:id")
    async getDisplayReview(@Param('id') id: string) {
        return this.homeService.getDisplayReview(id);
    }

    @Delete("review/:id")
    async deleteDisplayReview(@Param('id') id: string) {
        return this.homeService.deleteDisplayReview(id);
    }

    @Put("review/:id")
    async updateDisplayReview(@Param('id') id: string, @Body() displayReviewDto: DisplayReviewDto) {
        return this.homeService.updateDisplayReview(id, displayReviewDto);
    }

    @Patch("review/:id")
    async patchDisplayReview(@Param('id') id: string, @Body() displayReviewDto: DisplayReviewDto) {
        return this.homeService.patchDisplayReview(id, displayReviewDto);
    }
}
