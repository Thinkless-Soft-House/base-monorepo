import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const PostgresOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.user'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
});

const OrmConfig = PostgresOrmConfig;
export default OrmConfig;
