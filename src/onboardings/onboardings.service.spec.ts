import {
  DEFAULT_GUID,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { OnboardingsService } from './onboardings.service';
import { Repository } from 'typeorm';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.spec.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.spec.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OnboardingsService', () => {
  let service: OnboardingsService;
  let repository: Repository<Onboarding>;
  const REPOSITORY_TOKEN = getRepositoryToken(Onboarding);
  let onboardingStepsForTest: OnboardingStep;

  beforeAll(async () => {
    onboardingStepsForTest = await fakeOnboardingStepsService.create(
      defaultCreateOnboardingStepDto,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingsService,
        {
          provide: OnboardingStepsService,
          useValue: fakeOnboardingStepsService,
        },
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<Onboarding>() },
        },
      ],
    }).compile();

    service = module.get<OnboardingsService>(OnboardingsService);
    repository = module.get<Repository<Onboarding>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created onboarding', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('findAll returns the list of all onboardings including the newly created one', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findAllById returns the list of onboardings with ids in the provided search list ', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toContain(createdEntity);
  });

  it('findOne returns newly created onboarding', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no onboarding was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated onboarding with all changes updated', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });
    const updatedName = 'UPDATED Name';

    const updatedEntity = await service.update(createdEntity.id, {
      name: updatedName,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no onboarding was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        name: 'Updated Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [onboardingStepsForTest.id],
    });

    const removedEntity = await service.remove(createdEntity.id);

    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no onboarding was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
