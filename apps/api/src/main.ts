import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RequestIdMiddleware } from './common/logging/request-id.middleware'
import { LoggingInterceptor } from './common/logging/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(new RequestIdMiddleware().use)
  app.useGlobalInterceptors(new LoggingInterceptor())
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001)
}

bootstrap()
