import { Test, TestingModule } from '@nestjs/testing';
import { BoardUserController } from './board-user.controller';
import { BoardUserService } from './board-user.service';

describe('BoardUserController', () => {
  let controller: BoardUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardUserController],
      providers: [BoardUserService],
    }).compile();

    controller = module.get<BoardUserController>(BoardUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
