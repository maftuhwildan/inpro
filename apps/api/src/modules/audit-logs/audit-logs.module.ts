import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuditLogsService } from './audit-logs.service'

@Module({
  providers: [AuditLogsService, PrismaClient],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
