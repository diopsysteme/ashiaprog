import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { ApiResponse } from '../dto/global-response.dto';
import { AshiaException } from '../app/ashia.exception';
import { AshiaErrorPayload, HttpExceptionPayload } from '../type/types';

@Catch()
export class GlobalExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof AshiaException) {
      status = exception.getStatus();
      const payload = exception.getResponse() as AshiaErrorPayload;

      message = payload.message;
      errors = {
        errorCode: payload.errorCode,
        details: payload.details ?? null,
      };

      return res.status(status).json(ApiResponse.fail(message, errors));
    }

    if (exception instanceof UnauthorizedException) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.fail('Unauthorized'));
    }

    if (exception instanceof ForbiddenException) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json(ApiResponse.fail('Access denied'));
    }

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const r = exception.getResponse() as HttpExceptionPayload | string;

      const validationErrors = this.extractValidationErrors(r);

      if (validationErrors.length > 0) {
        message = 'Validation failed';
        errors = validationErrors;
      } else {
        message = this.extractHttpMessage(r, exception.message);
      }

      return res.status(status).json(ApiResponse.fail(message, errors));
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = this.extractHttpMessage(
        exception.getResponse(),
        exception.message,
      );

      return res.status(status).json(ApiResponse.fail(message));
    }

    return res.status(status).json(ApiResponse.fail(message));
  }

  private extractHttpMessage(r: unknown, fallback: string): string {
    if (typeof r === 'string') return r;

    if (typeof r === 'object' && r !== null) {
      const payload = r as HttpExceptionPayload;
      const m = payload.message;

      if (Array.isArray(m)) return m.join(', ');
      if (typeof m === 'string') return m;
    }

    return fallback;
  }

  private extractValidationErrors(r: unknown): string[] {
    if (typeof r !== 'object' || r === null) return [];

    const payload = r as HttpExceptionPayload;
    const m = payload.message;

    if (!Array.isArray(m)) return [];

    return m.filter((x): x is string => true);
  }
}
