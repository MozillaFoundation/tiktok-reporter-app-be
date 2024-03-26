import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

export const getDataSourceOptions = (): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldSync = isProduction
    ? false
    : process.env.PG_SYNCHRONIZE === 'true';
  const shouldLog = process.env.PG_LOGGING === 'true';

  return {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    // This will be false when going to production
    synchronize: shouldSync,
    logging: shouldLog,
    // FOR development and deployment
    entities: ['dist/**/*.entity{.ts,.js}'],
    // FOR end to end testing
    //entities: ['src/**/*.entity{.ts,.js}'],
    // Generating a migration: npm run migration:generate -n src/database/migrations/[NameOfMigration]
    // FOR development and deployment
    // migrations: ['src/database/migrations/*{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    // FOR end to end testing
    //migrations: ['src/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
  };
};

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
