import { Test, TestingModule } from '@nestjs/testing';
import { AssetAssignmentsController } from './asset-assignments.controller';

describe('AssetAssignmentsController', () => {
  let controller: AssetAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetAssignmentsController],
    }).compile();

    controller = module.get<AssetAssignmentsController>(AssetAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
