import { CreateOnboardingStepDto } from './create-onboarding-step.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOnboardingStepDto extends PartialType(
  CreateOnboardingStepDto,
) {}
