import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessEnvelopeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ nullable: true, example: null })
  errors: any;

  @ApiProperty({ example: '2026-02-05T13:14:03.294Z' })
  timestamp: string;

  // data sera “overridé” dans le schema
  data: unknown;
}
