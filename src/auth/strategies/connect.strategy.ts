import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../v1/auth.service';

@Injectable()
export class ConnectStrategy extends PassportStrategy(Strategy, 'connect') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(email, password): Promise<any> {
    const user = await this.authService.matchConnectUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
