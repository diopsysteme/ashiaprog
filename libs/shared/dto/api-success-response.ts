import { ApiProperty } from '@nestjs/swagger';

export function ApiSuccessResponse<T>(dataType: () => any) {
  class SuccessResponse {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Success' })
    message: string;

    @ApiProperty({ type: dataType, nullable: true })
    data: T | null;

    @ApiProperty({ nullable: true, type: [String] })
    errors: string[] | null;

    @ApiProperty({ example: '2026-02-05T13:14:03.294Z' })
    timestamp: string;
  }

  return SuccessResponse;
}
