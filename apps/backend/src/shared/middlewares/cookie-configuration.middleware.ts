import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieConfigurationMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const nodeEnv = this.configService.get<
      'development' | 'stage' | 'production'
    >('nodeEnv');

    if (nodeEnv === 'development') {
      next();
    } else {
      res.cookie('session', 'value', {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });

      next();
    }
  }
}
