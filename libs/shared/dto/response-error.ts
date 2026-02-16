import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseSwagger {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;

  @ApiProperty({ type: [String] })
  errors: string[];

  @ApiProperty({ example: '2026-02-05T13:14:03.294Z' })
  timestamp: string;
}
