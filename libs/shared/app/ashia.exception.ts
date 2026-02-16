import { HttpException } from '@nestjs/common';
import { ErrorCode, ErrorCodeKey } from './ashia.error';

export class AshiaException extends HttpException {
  readonly errorCode: ErrorCodeKey;
  readonly details?: unknown;

  constructor(
    errorCode: ErrorCodeKey,
    message?: string,
    details?: unknown,
    cause?: Error,
  ) {
    const def = ErrorCode[errorCode];

    super(
      {
        errorCode,
        message: message ?? def.message,
        details,
      },
      def.status,
      cause ? { cause } : undefined,
    );

    this.errorCode = errorCode;
    this.details = details;
  }
}
