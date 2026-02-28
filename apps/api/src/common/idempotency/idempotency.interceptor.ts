import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { IdempotencyService } from './idempotency.service'

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const key = request.headers['x-idempotency-key'] as string | undefined
    if (!key) {
      return next.handle()
    }

    const cached = this.idempotencyService.get(key)
    if (cached) {
      response.status(cached.statusCode)
      return of(cached.body)
    }

    return next.handle().pipe(
      tap((body) => {
        this.idempotencyService.set(key, {
          statusCode: response.statusCode ?? 200,
          body,
        })
      }),
    )
  }
}
