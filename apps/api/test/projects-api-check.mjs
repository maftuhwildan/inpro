import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/modules/projects/projects.controller.ts',
  'apps/api/src/modules/projects/projects.service.ts',
  'apps/api/src/modules/projects/dto/create-project.dto.ts',
  'apps/api/src/modules/projects/dto/update-project.dto.ts',
  'apps/api/src/modules/projects/dto/create-milestone.dto.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing projects API file: ${file}`)
  }
}

const controller = readFileSync('apps/api/src/modules/projects/projects.controller.ts', 'utf8')
for (const marker of ["@Controller('projects')", "@Post()", '@Get()', "@Patch(':id')", "@Post(':id/milestones')"]) {
  if (!controller.includes(marker)) {
    throw new Error(`ProjectsController missing endpoint marker: ${marker}`)
  }
}

const service = readFileSync('apps/api/src/modules/projects/projects.service.ts', 'utf8')
for (const marker of ['createProject', 'listProjects', 'updateProject', 'createMilestone']) {
  if (!service.includes(marker)) {
    throw new Error(`ProjectsService missing method: ${marker}`)
  }
}

console.log('projects api check passed')
