import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { DailyReportsController } from './daily-reports.controller'
import { DailyReportsService } from './daily-reports.service'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { IdempotencyModule } from '../../common/idempotency/idempotency.module'

@Module({
  imports: [AuditLogsModule, IdempotencyModule],
  controllers: [DailyReportsController],
  providers: [DailyReportsService, PrismaClient],
  exports: [DailyReportsService],
})
export class DailyReportsModule {}
