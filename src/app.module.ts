import { Module, ValidationPipe } from '@nestjs/common';

import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CountryCodesModule } from './countryCodes/country-codes.module';
import { DataBaseModule } from './database/database.module';
import { FormsModule } from './forms/forms.module';
import { OnboardingStepsModule } from './onboardingSteps/onboarding-steps.module';
import { OnboardingsModule } from './onboardings/onboardings.module';
import { PoliciesModule } from './policies/policies.module';
import { SeedersModule } from './seeders/seeders.module';
import { StudiesModule } from './studies/studies.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DataBaseModule,
    StudiesModule,
    CountryCodesModule,
    PoliciesModule,
    OnboardingStepsModule,
    OnboardingsModule,
    FormsModule,
    SeedersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
