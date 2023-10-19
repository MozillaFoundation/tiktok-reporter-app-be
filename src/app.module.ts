import { Module, ValidationPipe } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CountryCodesModule } from './countryCodes/country-codes.module';
import { DataBaseModule } from './database/database.module';
import { SeedersModule } from './seeders/seeders.module';
import { StudiesModule } from './studies/studies.module';

// TEST Cloud Build 11
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DataBaseModule,
    StudiesModule,
    CountryCodesModule,
    SeedersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
