import { Test, TestingModule } from '@nestjs/testing';
import { HomeBannerService } from './home_banner.service';

describe('HomeBannerService', () => {
  let service: HomeBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeBannerService],
    }).compile();

    service = module.get<HomeBannerService>(HomeBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
