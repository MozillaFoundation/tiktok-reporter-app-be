import { CreateOnboardingDto } from 'src/onboardings/dtos/create-onboarding.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { UpdateOnboardingDto } from 'src/onboardings/dtos/update-onboarding.dto';
import { getFakeEntityRepository } from './fake-repository.spec.util';

const fakeOnboardingRepository = getFakeEntityRepository<Onboarding>();

export const fakeOnboardingsService: Partial<OnboardingsService> = {
  create: async (createOnboardingDto: CreateOnboardingDto) => {
    const newPolicyDto = {
      name: createOnboardingDto.name,
    } as Onboarding;

    const createdPolicy = fakeOnboardingRepository.create(newPolicyDto);

    const savedPolicy = fakeOnboardingRepository.save(createdPolicy);

    return await savedPolicy;
  },
  findAll: async () => {
    return await fakeOnboardingRepository.find();
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundPolicy = await fakeOnboardingRepository.findOneBy({ id });

    if (!foundPolicy) {
      throw new NotFoundException('Onboarding was not found');
    }

    return foundPolicy;
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
    return await fakeOnboardingRepository.save(foundOnboarding);
  },
  remove: async (id: string) => {
    const foundOnboarding = await fakeOnboardingsService.findOne(id);

    return await fakeOnboardingRepository.remove(foundOnboarding);
  },
};
