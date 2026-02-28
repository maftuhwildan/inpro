import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Idempotent } from '../../common/idempotency/idempotent.decorator'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Idempotent()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto)
  }

  @Get()
  list(@Query('projectId') projectId?: string) {
    return this.tasksService.listTasks(projectId)
  }

  @Patch(':id')
  @Idempotent()
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto)
  }

  @Get('overdue/list')
  overdue() {
    return this.tasksService.listOverdueTasks()
  }
}
