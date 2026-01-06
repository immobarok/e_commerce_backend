import { Test, TestingModule } from '@nestjs/testing';
import { HomeBannerController } from './home_banner.controller';

describe('HomeBannerController', () => {
  let controller: HomeBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeBannerController],
    }).compile();

    controller = module.get<HomeBannerController>(HomeBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
