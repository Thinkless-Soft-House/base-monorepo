import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { formatInTimeZone } from 'date-fns-tz';

import { AppModule } from './app.module';
import { corsConfig } from '@config/cors.config';
import { TransformResponseInterceptor } from '@interceptors/default-response.interceptor';
import { DefaultExceptionFilter } from '@filters/default-exception.filter';
import helmetConfig from '@config/helmet.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<'development' | 'stage' | 'production'>(
    'nodeEnv',
  );
  const port = configService.get('port');
  console.log(`Running in ${nodeEnv} mode in port ${port}`);

  // Middlewares
  // Cors configurations
  const origins = configService.get('cors.origin');
  const onlyOrigin = configService.get('cors.onlyOrigin');
  app.enableCors(corsConfig(origins, onlyOrigin));

  // Helmet configurations
  const helmetConfigVars = configService.get('helmet');
  const helmetConfigOptions: any = {};
  if (helmetConfigVars.trustDomains) {
    helmetConfigOptions.trustDomains = helmetConfigVars.trustDomains;
  }
  if (helmetConfigVars.contentSecurityPolicySpecificTrustDomains) {
    helmetConfigOptions.contentSecurityPolicySpecificTrustDomains =
      helmetConfigVars.contentSecurityPolicySpecificTrustDomains;
  }
  app.use(helmet(helmetConfig(nodeEnv, helmetConfigOptions)));

  app.use(cookieParser());

  morgan.token('id', function getId(req) {
    return (req.headers['x-request-id'] as string) ?? 'null-id';
  });
  morgan.token('date-br', function getDate() {
    const timezone = 'America/Sao_Paulo';
    const date = new Date();
    return formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ssXXX');
  });

  const morganFormat =
    ':id => :date-br Req= :method :url :status :res[content-length] - :response-time ms';
  app.use(morgan(morganFormat));

  // Interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Exception Filter
  app.useGlobalFilters(new DefaultExceptionFilter());

  await app.listen(port);
}
bootstrap();
