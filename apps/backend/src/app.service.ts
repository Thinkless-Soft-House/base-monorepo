import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private logger: Logger) {}
  getHello(): string {
    return 'Hello World!';
  }

  getHelloNew(): string {
    return 'Hello World New!';
  }
}
