import { Module } from '@nestjs/common';
import { OnboardingStep } from './entities/onboarding-step.entity';
import { OnboardingStepsController } from './onboarding-steps.controller';
import { OnboardingStepsService } from './onboarding-steps.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingStep])],
  controllers: [OnboardingStepsController],
  providers: [OnboardingStepsService],
  exports: [OnboardingStepsService],
})
export class OnboardingStepsModule {}
