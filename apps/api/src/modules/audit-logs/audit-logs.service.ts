import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

type AuditLogInput = {
  actorId?: string
  module: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Prisma.InputJsonValue | null
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaClient) {}

  logAction(input: AuditLogInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma

    return client.auditLog.create({
      data: {
        actorId: input.actorId,
        module: input.module,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata === null ? Prisma.JsonNull : input.metadata,
      },
    })
  }
}
