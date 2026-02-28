import { Injectable, UnauthorizedException } from '@nestjs/common'

export type LoginMode = 'web' | 'mobile'

type LoginInput = {
  email: string
  password: string
  mode: LoginMode
}

@Injectable()
export class AuthService {
  login(input: LoginInput) {
    // Placeholder auth logic for foundation stage.
    if (!input.email || !input.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (input.mode === 'mobile') {
      return {
        mode: 'mobile',
        accessToken: 'dev-access-token',
        refreshToken: 'dev-refresh-token',
      }
    }

    return {
      mode: 'web',
      session: {
        id: 'dev-session-id',
      },
    }
  }
}
