import { AppShell } from '@/components/layout/app-shell'
import { ApiError, getOverdueTasks, getProjects, getTasks } from '@/lib/api-client'
import { TaskBoard } from '@/features/tasks/task-board'

export default async function TasksPage() {
  let loadError: string | undefined
  let tasks = []
  let overdueTasks = []
  let projects = []

  try {
    const [tasksData, overdueData, projectsData] = await Promise.all([
      getTasks(),
      getOverdueTasks(),
      getProjects(),
    ])

    tasks = tasksData
    overdueTasks = overdueData
    projects = projectsData
  } catch (error) {
    if (error instanceof ApiError) {
      loadError = error.message
    } else {
      loadError = 'Failed to load tasks data from API'
    }
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Tasks</h1>
      <TaskBoard initialTasks={tasks} initialOverdueTasks={overdueTasks} projects={projects} loadError={loadError} />
    </AppShell>
  )
}
