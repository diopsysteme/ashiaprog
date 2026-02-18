import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE } from './skip-response';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../dto/global-response.dto';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) {
      return next.handle() as any;
    }

    return next
      .handle()
      .pipe(
        map((data) =>
          data instanceof ApiResponse
            ? (data as any)
            : ApiResponse.ok('Success', data),
        ),
      );
  }
}
