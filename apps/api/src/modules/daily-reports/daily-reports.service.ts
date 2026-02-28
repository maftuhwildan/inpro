import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuditLogsService } from '../audit-logs/audit-logs.service'
import { CreateDailyReportDto } from './dto/create-daily-report.dto'

@Injectable()
export class DailyReportsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async createReport(dto: CreateDailyReportDto) {
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } })
    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return this.prisma.$transaction(async (tx) => {
      const report = await tx.dailyReport.create({
        data: {
          projectId: dto.projectId,
          reportDate: new Date(dto.reportDate),
          authorId: dto.authorId,
          activities: dto.activities,
          blockers: dto.blockers,
          notes: dto.notes,
          attachmentsRef: dto.attachmentsRef,
          weather: dto.weather,
          manpower: dto.manpower,
        },
      })

      await this.auditLogsService.logAction(
        {
          module: 'daily_reports',
          action: 'create',
          entityType: 'daily_report',
          entityId: report.id,
          metadata: {
            projectId: dto.projectId,
            authorId: dto.authorId,
          },
        },
        tx,
      )

      return report
    })
  }

  listReports(projectId?: string) {
    return this.prisma.dailyReport.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { reportDate: 'desc' },
    })
  }
}
