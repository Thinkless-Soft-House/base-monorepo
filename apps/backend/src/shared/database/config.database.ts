import { PhotoEntity } from '@modules/photos/schemas/photos.entity';
import { UserEntity } from '@modules/users/schemas/users.entity';
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
  autoLoadEntities: true,
  entities: [UserEntity, PhotoEntity],
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
});

const OrmConfig = PostgresOrmConfig;
export default OrmConfig;
