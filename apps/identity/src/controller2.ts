import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller()
export class IdentityEventsController {
  constructor(private readonly identityService: IdentityService) {}

  @EventPattern('workflow.created')
  handle(@Payload() data: any, @Ctx() ctx: RmqContext) {
console.log(data)
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();
    channel.ack(msg);
  }
}
