import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedIdeaController } from './generated-idea.controller';

describe('GeneratedIdeaController', () => {
  let controller: GeneratedIdeaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratedIdeaController],
    }).compile();

    controller = module.get<GeneratedIdeaController>(GeneratedIdeaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
