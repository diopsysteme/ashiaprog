import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WorkflowService {
  constructor(@Inject('RMQ_BUS') private readonly bus: ClientProxy) {}
  getHello(): string {
    return 'Hello World! from W';
  }

  publishTestEvent() {
    return this.bus.emit('workflow.created', {
      id: crypto.randomUUID(),
      at: new Date().toDateString(),
      text: 'create this job',
    });
  }
}
