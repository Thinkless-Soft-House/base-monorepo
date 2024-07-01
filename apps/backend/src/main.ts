import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import helmet from 'helmet';
// import * as chalk from 'chalk';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

// import { formatInTimeZone } from 'date-fns-tz';

import { AppModule } from './app.module';
import { corsConfig } from '@config/cors.config';
import { TransformResponseInterceptor } from '@interceptors/default-response.interceptor';
import { DefaultExceptionFilter } from '@filters/default-exception.filter';
import helmetConfig from '@config/helmet.config';
import { VersioningType } from '@nestjs/common';
import getMorgan from '@config/morgan.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<'development' | 'stage' | 'production'>(
    'nodeEnv',
  );
  const loogerLevel = configService.get('logger');
  app.useLogger(
    loogerLevel === 'verbose'
      ? ['error', 'warn', 'log', 'debug', 'verbose', 'fatal']
      : loogerLevel === 'advice'
        ? ['error', 'warn', 'fatal']
        : false,
  );

  const port = configService.get('port');

  // Middlewares
  // Cors configurations
  const origins = configService.get('cors.origin');
  const onlyOrigin = configService.get('cors.onlyOrigin');
  app.enableCors(corsConfig(origins, onlyOrigin));

  // Helmet configurations
  const helmetConfigVars = configService.get('helmet');
  const helmetConfigOptions: any = {
    trusDomains: helmetConfigVars.trustDomains ?? [],
    contentSecurityPolicySpecificTrustDomains:
      helmetConfigVars.contentSecurityPolicySpecificTrustDomains ?? {},
  };
  app.use(helmet(helmetConfig(nodeEnv, helmetConfigOptions)));

  app.use(cookieParser());
  const myMorgan = getMorgan(morgan);

  // Definindo o formato do Morgan com tokens personalizados
  const morganFormat =
    ':id => :date-br Req= :method :url :status :res[content-length] - :response-time';

  // Usando o middleware Morgan com o formato definido
  app.use(
    myMorgan(morganFormat, {
      stream: {
        write: (message) => console.log(message.trim()),
      },
    }),
  );

  // Interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Exception Filter
  app.useGlobalFilters(new DefaultExceptionFilter());

  // Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('defaultVersion'),
  });

  await app.listen(port);
  console.log(`Running in ${nodeEnv} mode in port ${port}`);
}
bootstrap();
