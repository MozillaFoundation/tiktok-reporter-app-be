import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

import { ConfigService } from '@nestjs/config';

export const getDataSourceOptions = (
  config?: ConfigService,
): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldSync = isProduction
    ? false
    : config?.get<boolean>('PG_SYNCHRONIZE') ||
      Boolean(process.env.PG_SYNCHRONIZE);

  console.log('*************************************************');
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  console.log('process.env.PG_DATABASE', process.env.PG_DATABASE);
  console.log('shouldSync', shouldSync);
  console.log('*************************************************');
  return {
    type: 'postgres',
    host: config?.get<string>('PG_HOST') || process.env.PG_HOST,
    port: config?.get<number>('PG_PORT') || Number(process.env.PG_PORT),
    database: config?.get<string>('PG_DATABASE') || process.env.PG_DATABASE,
    username: config?.get<string>('PG_USERNAME') || process.env.PG_USERNAME,
    password: config?.get<string>('PG_PASSWORD') || process.env.PG_PASSWORD,
    // autoLoadEntities: true,
    //TODO: Change to false when moving to production
    synchronize: shouldSync,
    logging:
      config?.get<boolean>('PG_LOGGING') || Boolean(process.env.PG_LOGGING),
    entities: ['dist/**/*.entity{.ts,.js}'],
    // generating a migration: npm run migration:generate -n src/database/migrations/[NameOfMigration]
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
  };
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
