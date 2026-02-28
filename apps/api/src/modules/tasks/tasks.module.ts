import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { PrismaClient } from '@prisma/client'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { IdempotencyModule } from '../../common/idempotency/idempotency.module'

@Module({
  imports: [AuditLogsModule, IdempotencyModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaClient],
  exports: [TasksService],
})
export class TasksModule {}
