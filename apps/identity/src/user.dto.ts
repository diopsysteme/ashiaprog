import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'Diop' })
  name: string;
  @ApiProperty({ example: 'dd.dd@dd.dd' })
  email: string;
}
