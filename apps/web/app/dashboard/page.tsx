import { AppShell } from '../../../components/layout/app-shell'
import { ApiError, getDailyReports, getOverdueTasks, getProjects } from '../../../lib/api-client'
import { DashboardKpisFeature } from '../../../features/dashboard/dashboard-kpis'

export default async function DashboardPage() {
  let loadError: string | undefined
  let projects = []
  let overdueTasks = []
  let recentReports = []

  try {
    const [projectsData, overdueData, reportsData] = await Promise.all([
      getProjects(),
      getOverdueTasks(),
      getDailyReports(),
    ])

    projects = projectsData
    overdueTasks = overdueData
    recentReports = reportsData
  } catch (error) {
    if (error instanceof ApiError) {
      loadError = error.message
    } else {
      loadError = 'Failed to load dashboard data from API'
    }
  }

  return (
    <AppShell>
      <h1>Operational Dashboard</h1>
      <DashboardKpisFeature
        projects={projects}
        overdueTasks={overdueTasks}
        recentReports={recentReports}
        loadError={loadError}
      />
    </AppShell>
  )
}
