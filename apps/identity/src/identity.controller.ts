import { Controller, Get } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { ApiErrorResponseSwagger } from '../../../libs/shared/dto/response-error';
import { apiSuccessResponseSchema } from '../../../libs/shared/dto/success-response-format';
import { UserDto } from './user.dto';
import { apiSuccessSchema } from '../../../libs/shared/dto/api-response.schema';
import { AshiaException } from '../../../libs/shared/app/ashia.exception';
import { ApiSuccessResponse } from '../../../libs/shared/dto/schema2';

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
