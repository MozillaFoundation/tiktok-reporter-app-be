import { CreateOnboardingStepDto } from 'src/onboardingSteps/dtos/create-onboarding-step.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { UpdateOnboardingStepDto } from 'src/onboardingSteps/dtos/update-onboarding-step.dto';
import { getFakeEntityRepository } from './fake-repository.util';

const fakeOnboardingStepRepository = getFakeEntityRepository<OnboardingStep>();

export const fakeOnboardingStepsService: Partial<OnboardingStepsService> = {
  create: async (createOnboardingStepDto: CreateOnboardingStepDto) => {
    const newOnboardingStep = {
      title: createOnboardingStepDto.title,
      description: createOnboardingStepDto.description,
      imageUrl: createOnboardingStepDto.imageUrl,
      details: createOnboardingStepDto.details,
      order: createOnboardingStepDto.order,
      onboardings: [],
    } as OnboardingStep;

    const createdOnboardingStep =
      await fakeOnboardingStepRepository.create(newOnboardingStep);

    const savedCountryCode = await fakeOnboardingStepRepository.save(
      createdOnboardingStep,
    );

    return await savedCountryCode;
  },
  findAll: async () => {
    return await fakeOnboardingStepRepository.find();
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundOnboardingStep = await fakeOnboardingStepRepository.findOneBy({
      id,
    });

    if (!foundOnboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    return foundOnboardingStep;
  },
  findAllById: async (onboardingStepIds: string[]) => {
    return await fakeOnboardingStepRepository.findBy({
      id: In(onboardingStepIds),
    });
  },
  update: async (
    id: string,
    updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) => {
    const onboardingStep = await fakeOnboardingStepsService.findOne(id);

    Object.assign(onboardingStep, {
      title: updateOnboardingStepDto.title || onboardingStep.title,
      description:
        updateOnboardingStepDto.description || onboardingStep.description,
      imageUrl: updateOnboardingStepDto.imageUrl || onboardingStep.imageUrl,
      details: updateOnboardingStepDto.details || onboardingStep.details,
      order: updateOnboardingStepDto.order || onboardingStep.order,
    });

    return await fakeOnboardingStepRepository.save(onboardingStep);
  },
  remove: async (id: string) => {
    const foundOnboardingStep = await fakeOnboardingStepsService.findOne(id);

    return await fakeOnboardingStepRepository.remove(foundOnboardingStep);
  },
};
