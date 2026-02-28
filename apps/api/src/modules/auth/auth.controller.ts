import { Body, Controller, Post } from '@nestjs/common'
import { AuthService, LoginMode } from './auth.service'

type LoginRequest = {
  email: string
  password: string
  mode?: LoginMode
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginRequest) {
    const mode = body.mode ?? 'web'
    return this.authService.login({
      email: body.email,
      password: body.password,
      mode,
    })
  }
}
