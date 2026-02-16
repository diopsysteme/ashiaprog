import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AshiaException } from '../../../libs/shared/app/ashia.exception';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    throw new AshiaException('INTERNAL_ERROR', 'hey');
    return this.gatewayService.getHello();
  }
}
