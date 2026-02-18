import { Controller, Get } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { ApiBadRequestResponse, ApiExtraModels } from '@nestjs/swagger';
import { ApiErrorResponseSwagger } from '../../../libs/shared/dto/response-error';
import { UserDto } from './user.dto';
import { ApiSuccessResponse } from '../../../libs/shared/dto/schema2';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
@ApiExtraModels(UserDto)
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
  @ApiSuccessResponse({ kind: 'model', model: UserDto })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ApiErrorResponseSwagger,
  })
  getHello(): UserDto {
    // throw new AshiaException('PHONE_ALREADY_EXISTS');
    return this.identityService.getHello();
  }


}
