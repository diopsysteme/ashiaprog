import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class IdentityService {
  getHello(): UserDto {
    return new UserDto();
  }
}
