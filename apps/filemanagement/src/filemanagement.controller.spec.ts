import { Test, TestingModule } from '@nestjs/testing';
import { FilemanagementController } from './filemanagement.controller';
import { FilemanagementService } from './filemanagement.service';

describe('FilemanagementController', () => {
  let filemanagementController: FilemanagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilemanagementController],
      providers: [FilemanagementService],
    }).compile();

    filemanagementController = app.get<FilemanagementController>(FilemanagementController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(filemanagementController.getHello()).toBe('Hello World!');
    });
  });
});
