import { Module } from '@nestjs/common';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingStepsModule } from 'src/onboardingSteps/onboarding-steps.module';
import { OnboardingsController } from './onboardings.controller';
import { OnboardingsService } from './onboardings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsModule } from 'src/forms/forms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Onboarding]),
    OnboardingStepsModule,
    FormsModule,
  ],
  controllers: [OnboardingsController],
  providers: [OnboardingsService],
  exports: [OnboardingsService],
})
export class OnboardingsModule {}
