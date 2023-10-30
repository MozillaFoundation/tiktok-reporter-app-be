import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CountryCodesModule } from './countryCodes/country-codes.module';
import { DataBaseModule } from './database/database.module';
import { FormsModule } from './forms/forms.module';
import { HttpModule } from '@nestjs/axios';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { OnboardingStepsModule } from './onboardingSteps/onboarding-steps.module';
import { OnboardingsModule } from './onboardings/onboardings.module';
import { PoliciesModule } from './policies/policies.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SeedersModule } from './seeders/seeders.module';
import { SentryInterceptor } from './interceptors/sentry.interceptor';
import { StudiesModule } from './studies/studies.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    PrometheusModule.register(),
    DataBaseModule,
    AuthModule,
    StudiesModule,
    CountryCodesModule,
    PoliciesModule,
    OnboardingStepsModule,
    OnboardingsModule,
    FormsModule,
    SeedersModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    SentryInterceptor,
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
