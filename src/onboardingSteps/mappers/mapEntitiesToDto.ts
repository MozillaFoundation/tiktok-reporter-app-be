import { isFilledArray } from 'src/utils/isFilledArray';
import { OnboardingStep } from '../entities/onboarding-step.entity';
import { OnboardingStepDto } from '../dtos/onboarding-step.dto';
import { mapOnboardingsToDtos } from 'src/onboardings/mappers/mapEntitiesToDto';

export function mapOnboardingStepsToDtos(
  onboardingSteps: Array<OnboardingStep>,
): Array<OnboardingStepDto> {
  if (!isFilledArray(onboardingSteps)) {
    return [];
  }
  const onboardingStepDtos = [];
  for (const onboardingStep of onboardingSteps) {
    onboardingStepDtos.push(mapOnboardingStepEntityToDto(onboardingStep));
  }

  return onboardingStepDtos;
}

export function mapOnboardingStepEntityToDto(onboardingStep: OnboardingStep) {
  if (!onboardingStep) {
    return null;
  }
  return {
    id: onboardingStep.id,
    title: onboardingStep.title,
    subtitle: onboardingStep.subtitle,
    description: onboardingStep.description,
    imageUrl: onboardingStep.imageUrl,
    details: onboardingStep.details,
    order: onboardingStep.order,
    onboardings: mapOnboardingsToDtos(onboardingStep.onboardings),
    createdAt: onboardingStep.createdAt,
    updatedAt: onboardingStep.updatedAt,
  } as OnboardingStepDto;
}
