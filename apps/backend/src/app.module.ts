import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppNewController } from './app-new.controller';

import { RequestIdMiddleware } from '@middlewares/request-id.middleware';
import { LocalizationMiddleware } from '@middlewares/request-location.middleware';
import { CookieConfigurationMiddleware } from '@middlewares/cookie-configuration.middleware';
import {
  configuration,
  validationSchema,
} from '@definitions/configuration.types';

import { AuthModule } from '@modules/auth/auth.module';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@guards/passport-jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import OrmConfig from '@database/config.database';
import { CacheModule } from '@nestjs/cache-manager';
import cacheConfig from '@config/cache.config';

const allModules = [AuthModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      envFilePath: [
        '.env.production',
        '.env.stage',
        '.env.development',
        '.env',
      ],
      validationSchema: validationSchema,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secretOrPrivateKey: configService.get('jwt.secret'),
          signOptions: { expiresIn: configService.get('jwt.ttl') },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => OrmConfig(configService),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        cacheConfig(configService),
    }),
    ...allModules,
    UsersModule,
  ],
  controllers: [AppController, AppNewController],
  providers: [
    AppService,
    Logger,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
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
