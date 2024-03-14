import { ApiKey } from 'src/auth/entities/api-key.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { CountryCodesModule } from 'src/countryCodes/country-codes.module';
import { FormsModule } from 'src/forms/forms.module';
import { GeolocationModule } from 'src/geolocation/geo-locaiton.module';
import { Module } from '@nestjs/common';
import { OnboardingsModule } from 'src/onboardings/onboardings.module';
import { PoliciesModule } from 'src/policies/policies.module';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Study, OnboardingStep, ApiKey]),
    CountryCodesModule,
    PoliciesModule,
    OnboardingsModule,
    FormsModule,
    GeolocationModule,
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
