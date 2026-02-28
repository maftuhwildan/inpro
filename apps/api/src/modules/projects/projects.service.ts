import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import { AuditLogsService } from '../audit-logs/audit-logs.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { CreateMilestoneDto } from './dto/create-milestone.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  createProject(dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name,
          client: dto.client,
          location: dto.location,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          picUserId: dto.picUserId,
        },
      })

      await this.auditLogsService.logAction(
        {
          module: 'projects',
          action: 'create',
          entityType: 'project',
          entityId: project.id,
          metadata: { name: project.name },
        },
        tx,
      )

      return project
    })
  }

  listProjects() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { milestones: true },
    })
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Project not found')
    }

    if (dto.expectedUpdatedAt) {
      const expected = new Date(dto.expectedUpdatedAt).getTime()
      const current = existing.updatedAt.getTime()
      if (Number.isNaN(expected) || expected !== current) {
        throw new ConflictException('Project has been modified by another process')
      }
    }

    const data: Prisma.ProjectUpdateInput = {
      name: dto.name,
      client: dto.client,
      location: dto.location,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      picUserId: dto.picUserId,
      status: dto.status,
      progress: dto.progress,
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.update({ where: { id }, data })

      await this.auditLogsService.logAction(
        {
          module: 'projects',
          action: 'update',
          entityType: 'project',
          entityId: id,
          metadata: {
            status: dto.status,
            progress: dto.progress,
          },
        },
        tx,
      )

      return project
    })
  }

  async createMilestone(projectId: string, dto: CreateMilestoneDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.create({
        data: {
          projectId,
          title: dto.title,
          targetDate: new Date(dto.targetDate),
          status: dto.status ?? 'PENDING',
        },
      })

      await this.auditLogsService.logAction(
        {
          module: 'projects',
          action: 'create_milestone',
          entityType: 'milestone',
          entityId: milestone.id,
          metadata: { projectId },
        },
        tx,
      )

      return milestone
    })
  }
}
