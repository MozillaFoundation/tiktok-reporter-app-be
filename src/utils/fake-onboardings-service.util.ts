import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateOnboardingDto } from 'src/onboardings/dtos/create-onboarding.dto';
import { In } from 'typeorm';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { UpdateOnboardingDto } from 'src/onboardings/dtos/update-onboarding.dto';
import { fakeOnboardingStepsService } from './fake-onboarding-steps-service.util';
import { getFakeEntityRepository } from './fake-repository.util';
import { removeDuplicateObjects } from './remove-duplicates';

const fakeOnboardingRepository = getFakeEntityRepository<Onboarding>();

export const fakeOnboardingsService: Partial<OnboardingsService> = {
  create: async (createOnboardingDto: CreateOnboardingDto) => {
    const onboardingSteps = await fakeOnboardingStepsService.findAllById(
      createOnboardingDto.stepIds,
    );

    if (!onboardingSteps.length) {
      throw new BadRequestException(
        'No Onboarding steps with the given id exist',
      );
    }

    const newOnboarding = {
      name: createOnboardingDto.name,
      steps: onboardingSteps,
    } as Onboarding;

    const createdOnboarding = fakeOnboardingRepository.create(newOnboarding);

    const savedOnboarding = fakeOnboardingRepository.save(createdOnboarding);

    return await savedOnboarding;
  },
  findAll: async () => {
    return await fakeOnboardingRepository.find();
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundOnboarding = await fakeOnboardingRepository.findOneBy({ id });

    if (!foundOnboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    return foundOnboarding;
  },
  findAllById: async (policyIds: string[]) => {
    return await fakeOnboardingRepository.findBy({
      id: In(policyIds),
    });
  },
  update: async (id: string, updateOnboardingDto: UpdateOnboardingDto) => {
    const foundOnboarding = await fakeOnboardingsService.findOne(id);

    Object.assign(foundOnboarding, {
      name: updateOnboardingDto.name || foundOnboarding.name,
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

    return await fakeOnboardingRepository.save(foundOnboarding);
  },
  remove: async (id: string) => {
    const foundOnboarding = await fakeOnboardingsService.findOne(id);

    return await fakeOnboardingRepository.remove(foundOnboarding);
  },
};
