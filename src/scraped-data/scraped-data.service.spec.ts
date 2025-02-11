import { Test, TestingModule } from '@nestjs/testing';
import { ScrapedDataService } from './scraped_data.service';

describe('ScrapedDataService', () => {
  let service: ScrapedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapedDataService],
    }).compile();

    service = module.get<ScrapedDataService>(ScrapedDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
