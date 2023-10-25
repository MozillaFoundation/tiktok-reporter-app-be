import { Module } from '@nestjs/common';
import { OnboardingStep } from './entities/onboarding-step.entity';
import { OnboardingStepsController } from './onboarding-steps.controller';
import { OnboardingStepsService } from './onboarding-steps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingStep, ApiKey])],
  controllers: [OnboardingStepsController],
  providers: [OnboardingStepsService],
  exports: [OnboardingStepsService],
})
export class OnboardingStepsModule {}
