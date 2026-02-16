import { Controller, Get } from '@nestjs/common';
import { FilemanagementService } from './filemanagement.service';

@Controller()
export class FilemanagementController {
  constructor(private readonly filemanagementService: FilemanagementService) {}

  @Get()
  getHello(): string {
    return this.filemanagementService.getHello();
  }
}
