// When running migrations uncomment
// import 'dotenv/config';

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

  return {
    type: 'postgres',
    host: config?.get<string>('PG_HOST') || process.env.PG_HOST,
    port: config?.get<number>('PG_PORT') || Number(process.env.PG_PORT),
    database: config?.get<string>('PG_DATABASE') || process.env.PG_DATABASE,
    username: config?.get<string>('PG_USERNAME') || process.env.PG_USERNAME,
    password: config?.get<string>('PG_PASSWORD') || process.env.PG_PASSWORD,
    // autoLoadEntities: true,
    // This will be false when going to production
    synchronize: shouldSync,
    logging:
      config?.get<boolean>('PG_LOGGING') || Boolean(process.env.PG_LOGGING),
    // For deployment and migrations
    entities: ['dist/**/*.entity{.ts,.js}'],
    // For testing
    // entities: ['src/**/*.entity{.ts,.js}'],
    // Generating a migration: npm run migration:generate -n src/database/migrations/[NameOfMigration]
    // For deployment
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    // For testing
    // migrations: ['src/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
  };
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
