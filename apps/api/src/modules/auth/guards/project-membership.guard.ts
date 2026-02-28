import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ProjectMembershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const userProjectIds: string[] = request.user?.projectIds ?? []

    const projectId =
      request.params?.projectId ??
      request.params?.id ??
      request.body?.projectId ??
      request.query?.projectId

    if (!projectId) {
      return true
    }

    return userProjectIds.includes(String(projectId))
  }
}
