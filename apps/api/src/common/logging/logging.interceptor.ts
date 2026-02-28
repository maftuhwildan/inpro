import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const startedAt = Date.now()
    return next.handle().pipe(
      tap(() => {
        const tookMs = Date.now() - startedAt
        const log = {
          requestId: req.requestId,
          method: req.method,
          path: req.url,
          tookMs,
        }
        // baseline structured log
        console.log(JSON.stringify(log))
      }),
    )
  }
}
