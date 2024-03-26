import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateOnboardingDto } from 'src/onboardings/dtos/create-onboarding.dto';
import { In } from 'typeorm';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { UpdateOnboardingDto } from 'src/onboardings/dtos/update-onboarding.dto';
import { fakeOnboardingStepsService } from './fake-onboarding-steps-service.util';
import { getFakeEntityRepository } from './fake-repository.util';
import { removeDuplicateObjects } from './remove-duplicates';
import { fakeFormsService } from './fake-forms-service.util';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapOnboardingEntityToDto,
  mapOnboardingsToDtos,
} from 'src/onboardings/mappers/mapEntitiesToDto';

export const fakeOnboardingRepository = getFakeEntityRepository<Onboarding>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakeOnboardingsService: Partial<OnboardingsService> = {
  create: async (
    headerApiKey: string,
    createOnboardingDto: CreateOnboardingDto,
  ) => {
    const onboardingSteps = await fakeOnboardingStepsService.findAllById(
      createOnboardingDto.stepIds,
    );

    if (!onboardingSteps.length) {
      throw new BadRequestException(
        'No Onboarding steps with the given id exist',
      );
    }

    const form = await fakeFormsService.findOne(createOnboardingDto.formId);

    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const newOnboarding = {
      name: createOnboardingDto.name,
      steps: onboardingSteps,
      form,
      createdBy: savedApiKey,
    } as Onboarding;

    const createdOnboarding =
      await fakeOnboardingRepository.create(newOnboarding);

    const savedOnboarding =
      await fakeOnboardingRepository.save(createdOnboarding);

    return mapOnboardingEntityToDto(savedOnboarding);
  },
  findAll: async () => {
    const allOnboardings = await fakeOnboardingRepository.find();

    return mapOnboardingsToDtos(allOnboardings);
  },
  findOne: async (id: string) => {
    const foundOnboarding = await fakeOnboardingRepository.findOneBy({ id });

    if (!foundOnboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    return mapOnboardingEntityToDto(foundOnboarding);
  },
  findAllById: async (policyIds: string[]) => {
    const allOnboardingsById = await fakeOnboardingRepository.findBy({
      id: In(policyIds),
    });

    return mapOnboardingsToDtos(allOnboardingsById);
  },
  update: async (
    headerApiKey: string,
    id: string,
    updateOnboardingDto: UpdateOnboardingDto,
  ) => {
    const foundOnboarding = await fakeOnboardingsService.findOne(id);

    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(foundOnboarding, {
      name: updateOnboardingDto.name || foundOnboarding.name,
      updatedBy: savedApiKey,
    });

    if (updateOnboardingDto.stepIds) {
      const onboardingSteps = await fakeOnboardingStepsService.findAllById(
        updateOnboardingDto.stepIds,
      );

      if (!onboardingSteps.length) {
        throw new BadRequestException(
          'No Onboarding steps with the given id exist',
        );
      }

      const updatedOnboardingSteps = removeDuplicateObjects(
        [...foundOnboarding.steps, ...onboardingSteps],
        'id',
      );

      Object.assign(foundOnboarding, {
        steps: updatedOnboardingSteps,
      });
    }

    if (updateOnboardingDto.formId) {
      const form = await fakeFormsService.findOne(updateOnboardingDto.formId);

      Object.assign(foundOnboarding, {
        form,
      });
    }

    const updatedEntity = await fakeOnboardingRepository.save(foundOnboarding);

    return mapOnboardingEntityToDto(updatedEntity);
  },
  remove: async (id: string) => {
    const foundOnboarding = await fakeOnboardingRepository.findOneBy({ id });

    if (!foundOnboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    const removedEntity =
      await fakeOnboardingRepository.remove(foundOnboarding);

    return mapOnboardingEntityToDto(removedEntity);
  },
};

Object.assign(fakeOnboardingsService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
