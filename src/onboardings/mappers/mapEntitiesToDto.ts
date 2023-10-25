import { isFilledArray } from 'src/utils/isFilledArray';
import { OnboardingDto } from '../dtos/onboarding.dto';
import { Onboarding } from '../entities/onboarding.entity';
import { mapOnboardingStepsToDtos } from 'src/onboardingSteps/mappers/mapEntitiesToDto';
import { mapStudiesToDtos } from 'src/studies/mappers/mapEntitiesToDto';
import { mapFormEntityToDto } from 'src/forms/mappers/mapEntitiesToDto';

export function mapOnboardingsToDtos(
  onboardings: Array<Onboarding>,
): Array<OnboardingDto> {
  if (!isFilledArray(onboardings)) {
    return [];
  }

  const onboardingDtos = [];
  for (const onboarding of onboardings) {
    onboardingDtos.push(mapOnboardingEntityToDto(onboarding));
  }

  return onboardingDtos;
}

export function mapOnboardingEntityToDto(
  onboarding: Onboarding,
): OnboardingDto {
  if (!onboarding) {
    return null;
  }
  return {
    id: onboarding.id,
    name: onboarding.name,
    steps: mapOnboardingStepsToDtos(onboarding.steps),
    studies: mapStudiesToDtos(onboarding.studies),
    form: mapFormEntityToDto(onboarding.form),
    createdAt: onboarding.createdAt,
    updatedAt: onboarding.updatedAt,
  } as OnboardingDto;
}
