import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const locale = req.headers['accept-language']?.split(',')[0] || 'pt-br';
    req['locale'] = locale;
    next();
  }
}
