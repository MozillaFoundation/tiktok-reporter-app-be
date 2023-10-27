import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('I am starting the db: ', process.env.NODE_ENV);
        return {
          type: 'postgres',
          host: config.get<string>('PG_HOST') || process.env.PG_HOST,
          port: config.get<number>('PG_PORT') || Number(process.env.PG_PORT),
          database:
            config.get<string>('PG_DATABASE') || process.env.PG_DATABASE,
          username:
            config.get<string>('PG_USERNAME') || process.env.PG_USERNAME,
          password:
            config.get<string>('PG_PASSWORD') || process.env.PG_PASSWORD,
          autoLoadEntities: true,
          //TODO: Change to false when moving to production
          synchronize:
            config.get<boolean>('PG_SYNCHRONIZE') ||
            Boolean(process.env.PG_SYNCHRONIZE),
          logging:
            config.get<boolean>('PG_LOGGING') ||
            Boolean(process.env.PG_LOGGING),
        };
      },
    }),
  ],
})
export class DataBaseModule {}
