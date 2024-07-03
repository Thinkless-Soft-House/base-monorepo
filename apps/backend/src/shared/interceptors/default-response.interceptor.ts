import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessHandlerResponse } from '@definitions/http.types';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const skipStandardization = request.headers['x-skip-standardization'];

    return next.handle().pipe(
      map((data) => {
        if (skipStandardization || data instanceof SuccessHandlerResponse) {
          return data;
        }
        return new SuccessHandlerResponse(data);
      }),
    );
  }
}
