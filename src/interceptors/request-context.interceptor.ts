import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export enum MobilePlatform {
  ANDROID = 'android',
  IOS = 'ios',
}

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.setMobilePlatform(context, next);
  }

  private setMobilePlatform(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';

    let platform;
    // Assume all other requests are iOS, for now
    if (userAgent.indexOf('okhttp/') >= 0) {
      platform = MobilePlatform.ANDROID;
    } else {
      platform = MobilePlatform.IOS;
    }
    request.extraContext = {
      platform,
    };

    return next.handle();
  }
}
