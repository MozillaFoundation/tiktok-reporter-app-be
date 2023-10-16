import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow<string>('PG_HOST'),
          port: config.getOrThrow<number>('PG_PORT'),
          database: config.getOrThrow<string>('PG_DATABASE'),
          username: config.getOrThrow<string>('PG_USERNAME'),
          password: config.getOrThrow<string>('PG_PASSWORD'),
          autoLoadEntities: true,
          //TODO: Change to false when moving to production
          synchronize: config.getOrThrow<boolean>('PG_SYNCHRONIZE'),
          logging: config.getOrThrow<boolean>('PG_LOGGING'),
        };
      },
    }),
  ],
})
export class DataBaseModule {}
