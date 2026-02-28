import { readFileSync } from 'node:fs'

const projectService = readFileSync('apps/api/src/modules/projects/projects.service.ts', 'utf8')
const taskService = readFileSync('apps/api/src/modules/tasks/tasks.service.ts', 'utf8')
const projectDto = readFileSync('apps/api/src/modules/projects/dto/update-project.dto.ts', 'utf8')
const taskDto = readFileSync('apps/api/src/modules/tasks/dto/update-task.dto.ts', 'utf8')

if (!projectDto.includes('expectedUpdatedAt')) {
  throw new Error('UpdateProjectDto must include expectedUpdatedAt for optimistic concurrency')
}
if (!taskDto.includes('expectedUpdatedAt')) {
  throw new Error('UpdateTaskDto must include expectedUpdatedAt for optimistic concurrency')
}

if (!projectService.includes('ConflictException')) {
  throw new Error('ProjectsService should use ConflictException for stale writes')
}
if (!taskService.includes('ConflictException')) {
  throw new Error('TasksService should use ConflictException for stale writes')
}

if (!projectService.includes('expectedUpdatedAt') || !taskService.includes('expectedUpdatedAt')) {
  throw new Error('Update services must compare expectedUpdatedAt with current updatedAt')
}

console.log('concurrency check passed')
