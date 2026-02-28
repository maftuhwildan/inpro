import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { DailyReportsModule } from './modules/daily-reports/daily-reports.module'
import { UsersRolesModule } from './modules/users-roles/users-roles.module'
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module'

@Module({
  imports: [AuthModule, ProjectsModule, TasksModule, DailyReportsModule, UsersRolesModule, AuditLogsModule],
})
export class AppModule {}
