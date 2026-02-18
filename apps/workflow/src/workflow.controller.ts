import { Controller, Get, Post } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { SkipResponseWrap } from '../../../libs/shared/filter/skip-response';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @SkipResponseWrap()
  @Get()
  getHello(): string {
    return this.workflowService.getHello();
  }
  @Get('wrapped')
  getHelloWrap(): string {
    return this.workflowService.getHello() + 'wrapped';
  }

  @Post('test-event')
  testEvent() {
    this.workflowService.publishTestEvent();
    return { ok: true };
  }
}
