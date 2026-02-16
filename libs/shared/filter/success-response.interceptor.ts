import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/global-response.dto';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next.handle().pipe(
      map((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (data instanceof ApiResponse) return data as any;

        return ApiResponse.ok('Success', data);
      }),
    );
  }
}
