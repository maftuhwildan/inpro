import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { DailyReportsService } from './daily-reports.service'
import { CreateDailyReportDto } from './dto/create-daily-report.dto'
import { Idempotent } from '../../common/idempotency/idempotent.decorator'

@Controller('daily-reports')
export class DailyReportsController {
  constructor(private readonly dailyReportsService: DailyReportsService) {}

  @Post()
  @Idempotent()
  create(@Body() dto: CreateDailyReportDto) {
    return this.dailyReportsService.createReport(dto)
  }

  @Get()
  list(@Query('projectId') projectId?: string) {
    return this.dailyReportsService.listReports(projectId)
  }
}
