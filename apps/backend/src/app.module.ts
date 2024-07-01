import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { RequestIdMiddleware } from '@middlewares/request-id.middleware';
import { LocalizationMiddleware } from '@middlewares/request-location.middleware';
import { CookieConfigurationMiddleware } from '@middlewares/cookie-configuration.middleware';
import {
  configuration,
  validationSchema,
} from '@definitions/configuration.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      // cache: true,
      envFilePath: [
        '.env.production',
        '.env.stage',
        '.env.development',
        '.env',
      ],
      validationSchema: validationSchema,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        LocalizationMiddleware,
        CookieConfigurationMiddleware,
      )
      .forRoutes('*');
  }
}
