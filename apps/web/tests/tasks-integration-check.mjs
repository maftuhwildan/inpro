import { existsSync, readFileSync } from 'node:fs'

if (!existsSync('apps/web/features/tasks/task-board.tsx')) {
  throw new Error('Missing tasks feature component: task-board.tsx')
}

const tasksPage = readFileSync('apps/web/app/tasks/page.tsx', 'utf8')
for (const marker of ['getTasks', 'getOverdueTasks', 'getProjects']) {
  if (!tasksPage.includes(marker)) {
    throw new Error(`Tasks page must load marker from API client: ${marker}`)
  }
}

const taskBoard = readFileSync('apps/web/features/tasks/task-board.tsx', 'utf8')
for (const marker of ['createTask', 'updateTask', 'expectedUpdatedAt']) {
  if (!taskBoard.includes(marker)) {
    throw new Error(`task-board missing marker: ${marker}`)
  }
}

const apiClient = readFileSync('apps/web/lib/api-client.ts', 'utf8')
if (!apiClient.includes('x-idempotency-key')) {
  throw new Error('api-client must send x-idempotency-key for task mutations')
}

console.log('tasks integration check passed')
