import { CreateOnboardingStepDto } from 'src/onboardingSteps/dtos/create-onboarding-step.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { UpdateOnboardingStepDto } from 'src/onboardingSteps/dtos/update-onboarding-step.dto';
import { getFakeEntityRepository } from './fake-repository.util';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapOnboardingStepEntityToDto,
  mapOnboardingStepsToDtos,
} from 'src/onboardingSteps/mappers/mapEntitiesToDto';

export const fakeOnboardingStepRepository =
  getFakeEntityRepository<OnboardingStep>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakeOnboardingStepsService: Partial<OnboardingStepsService> = {
  create: async (
    headerApiKey: string,
    createOnboardingStepDto: CreateOnboardingStepDto,
  ) => {
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const newOnboardingStep = {
      title: createOnboardingStepDto.title,
      platform: createOnboardingStepDto.platform,
      subtitle: createOnboardingStepDto.subtitle,
      description: createOnboardingStepDto.description,
      imageUrl: createOnboardingStepDto.imageUrl,
      details: createOnboardingStepDto.details,
      order: createOnboardingStepDto.order,
      onboardings: [],
      createdBy: savedApiKey,
    } as OnboardingStep;

    const createdOnboardingStep =
      await fakeOnboardingStepRepository.create(newOnboardingStep);

    const savedOnboardingStep = await fakeOnboardingStepRepository.save(
      createdOnboardingStep,
    );

    return mapOnboardingStepEntityToDto(savedOnboardingStep);
  },
  findAll: async () => {
    const allOnboardingSteps = await fakeOnboardingStepRepository.find();

    return mapOnboardingStepsToDtos(allOnboardingSteps);
  },
  findOne: async (id: string) => {
    const foundOnboardingStep = await fakeOnboardingStepRepository.findOneBy({
      id,
    });

    if (!foundOnboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    return mapOnboardingStepEntityToDto(foundOnboardingStep);
  },
  findAllById: async (onboardingStepIds: string[]) => {
    const allOnboardingStepsById = await fakeOnboardingStepRepository.findBy({
      id: In(onboardingStepIds),
    });

    return mapOnboardingStepsToDtos(allOnboardingStepsById);
  },
  update: async (
    headerApiKey: string,
    id: string,
    updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) => {
    const onboardingStep = await fakeOnboardingStepsService.findOne(id);
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(onboardingStep, {
      title: updateOnboardingStepDto.title || onboardingStep.title,
      platform: updateOnboardingStepDto.platform || onboardingStep.platform,
      subtitle: updateOnboardingStepDto.subtitle || onboardingStep.subtitle,
      description:
        updateOnboardingStepDto.description || onboardingStep.description,
      imageUrl: updateOnboardingStepDto.imageUrl || onboardingStep.imageUrl,
      details: updateOnboardingStepDto.details || onboardingStep.details,
      order: updateOnboardingStepDto.order || onboardingStep.order,
      updatedBy: savedApiKey,
    });

    const updatedStep = await fakeOnboardingStepRepository.save(onboardingStep);

    return mapOnboardingStepEntityToDto(updatedStep);
  },
  remove: async (id: string) => {
    const foundOnboardingStep = await fakeOnboardingStepRepository.findOneBy({
      id,
    });

    if (!foundOnboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    const removedOnboardingStep =
      await fakeOnboardingStepRepository.remove(foundOnboardingStep);

    return mapOnboardingStepEntityToDto(removedOnboardingStep);
  },
};

Object.assign(fakeOnboardingStepsService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
