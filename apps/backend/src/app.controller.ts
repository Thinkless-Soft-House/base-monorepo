import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '@guards/passport-jwt.guard';
import { Public } from '@decorators/public.decorator';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  getHelloProtected(@Request() req: any): string {
    return this.appService.getHello() + JSON.stringify(req.user);
  }
}
