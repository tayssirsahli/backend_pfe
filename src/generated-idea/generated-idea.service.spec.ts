import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedIdeaService } from './generated-idea.service';

describe('GeneratedIdeaService', () => {
  let service: GeneratedIdeaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedIdeaService],
    }).compile();

    service = module.get<GeneratedIdeaService>(GeneratedIdeaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
