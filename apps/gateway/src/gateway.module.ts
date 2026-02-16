import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AppModule } from './app/app.module';

@Module({
  imports: [AppModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
