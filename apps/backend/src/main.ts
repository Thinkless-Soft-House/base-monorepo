import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { formatInTimeZone } from 'date-fns-tz';
import { TransformResponseInterceptor } from './shared/interceptors/default-response.interceptor';
import { DefaultExceptionFilter } from './shared/filters/default-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(helmet());

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

  await app.listen(3000);
}
bootstrap();
