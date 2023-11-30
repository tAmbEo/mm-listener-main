import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  map,
  // catchError
} from 'rxjs/operators';

@Injectable()
export class ResInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((_data) => {
        let result = _data;
        if (_data === true) {
          _data = {success: true}
        }
        return { data: _data }
      })
    );
  }
}
