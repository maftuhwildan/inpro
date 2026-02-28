import { existsSync } from 'node:fs'

if (!existsSync('apps/api')) {
  throw new Error("Missing folder: apps/api")
}

if (!existsSync('apps/web')) {
  throw new Error("Missing folder: apps/web")
}

console.log('workspace layout check passed')
