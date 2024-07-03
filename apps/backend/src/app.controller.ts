import {
  Controller,
  Get,
  Inject,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '@guards/passport-jwt.guard';
import { Public } from '@decorators/public.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CustomCacheInterceptor } from '@interceptors/custom-cache.interceptor';
import { CacheTTL } from '@decorators/cache.decorator';

@UseInterceptors(CustomCacheInterceptor)
@CacheTTL(60000)
@Controller({
  version: '1',
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

  @Get('cache')
  async cache() {
    const value = await this.cacheManager.get('test-key');
    if (!value) {
      await this.cacheManager.set('test-key', 'test-value', 10000);
      return 'Cache set';
    }
    return `Cache hit: ${value}`;
  }
}
