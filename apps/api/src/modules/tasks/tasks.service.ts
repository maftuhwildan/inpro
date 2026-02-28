import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import { AuditLogsService } from '../audit-logs/audit-logs.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async createTask(dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } })
    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          projectId: dto.projectId,
          title: dto.title,
          description: dto.description,
          assigneeId: dto.assigneeId,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          priority: dto.priority ?? 'MEDIUM',
        },
      })

      await this.auditLogsService.logAction(
        {
          module: 'tasks',
          action: 'create',
          entityType: 'task',
          entityId: task.id,
          metadata: { projectId: dto.projectId },
        },
        tx,
      )

      return task
    })
  }

  listTasks(projectId?: string) {
    return this.prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Task not found')
    }

    if (dto.expectedUpdatedAt) {
      const expected = new Date(dto.expectedUpdatedAt).getTime()
      const current = existing.updatedAt.getTime()
      if (Number.isNaN(expected) || expected !== current) {
        throw new ConflictException('Task has been modified by another process')
      }
    }

    const data: Prisma.TaskUpdateInput = {
      title: dto.title,
      description: dto.description,
      assigneeId: dto.assigneeId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      priority: dto.priority,
      status: dto.status,
    }

    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.update({ where: { id }, data })

      await this.auditLogsService.logAction(
        {
          module: 'tasks',
          action: 'update',
          entityType: 'task',
          entityId: id,
          metadata: {
            status: dto.status,
            assigneeId: dto.assigneeId,
          },
        },
        tx,
      )

      return task
    })
  }

  listOverdueTasks(now: Date = new Date()) {
    return this.prisma.task.findMany({
      where: {
        dueDate: { lt: now },
        status: { not: 'DONE' },
      },
      orderBy: { dueDate: 'asc' },
    })
  }
}
