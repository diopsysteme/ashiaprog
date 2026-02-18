import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { IdentityEventsController } from './controller2';

@Module({
  imports: [],
  controllers: [IdentityController, IdentityEventsController],
  providers: [IdentityService],
})
export class IdentityModule {}
