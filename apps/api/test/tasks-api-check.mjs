import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/modules/tasks/tasks.controller.ts',
  'apps/api/src/modules/tasks/tasks.service.ts',
  'apps/api/src/modules/tasks/dto/create-task.dto.ts',
  'apps/api/src/modules/tasks/dto/update-task.dto.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing tasks API file: ${file}`)
  }
}

const controller = readFileSync('apps/api/src/modules/tasks/tasks.controller.ts', 'utf8')
for (const marker of ["@Controller('tasks')", "@Post()", '@Get()', "@Patch(':id')", "@Get('overdue/list')"]) {
  if (!controller.includes(marker)) {
    throw new Error(`TasksController missing endpoint marker: ${marker}`)
  }
}

const service = readFileSync('apps/api/src/modules/tasks/tasks.service.ts', 'utf8')
for (const marker of ['createTask', 'listTasks', 'updateTask', 'listOverdueTasks']) {
  if (!service.includes(marker)) {
    throw new Error(`TasksService missing method: ${marker}`)
  }
}

console.log('tasks api check passed')
