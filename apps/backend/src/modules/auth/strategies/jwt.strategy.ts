import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:
        configService.get('jwt.ignoreExpiration') === 'true' ? true : false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, username: payload.email };
  }
}
