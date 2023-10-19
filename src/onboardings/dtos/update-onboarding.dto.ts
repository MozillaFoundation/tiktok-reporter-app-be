import { CreateOnboardingDto } from './create-onboarding.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOnboardingDto extends PartialType(CreateOnboardingDto) {}
