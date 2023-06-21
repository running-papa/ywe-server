import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return {
      uuid: payload.uuid,
      provider: payload.provider,
      nickName: payload.nickName,
      phone: payload.phone,
      fox: payload.fox,
      email: payload.email,
      password: payload.password,
    };
  }
}
