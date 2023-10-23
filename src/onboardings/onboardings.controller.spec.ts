import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingsController } from './onboardings.controller';
import { OnboardingsService } from './onboardings.service';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';

describe('OnboardingsController', () => {
  let controller: OnboardingsController;
  let firstOnboardingStep: OnboardingStep;
  let secondOnboardingStep: OnboardingStep;

  beforeAll(async () => {
    firstOnboardingStep = await fakeOnboardingStepsService.create(
      defaultCreateOnboardingStepDto,
    );

    secondOnboardingStep = await fakeOnboardingStepsService.create({
      title: 'Test Second Onboarding Step Title',
      description: 'Test Second Onboarding Step Description',
      imageUrl: 'Test Second Onboarding Step ImageURL',
      details: 'Test Second Onboarding Step Details',
      order: 2,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingsController],
      providers: [
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
      ],
    }).compile();

    controller = module.get<OnboardingsController>(OnboardingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created onboarding step', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
    });

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('create throws error if non existent onboarding step id is provided', async () => {
    await expect(
      controller.create({
        ...defaultCreateOnboardingDto,
        stepIds: [DEFAULT_GUID],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll returns the list of all onboarding steps including the newly created one', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
    });

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findOne returns newly created onboarding step', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
    });

    const foundEntity = await controller.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no onboarding step was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated onboarding step with all changes updated', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
    });

    const updatedName = 'UPDATED Name';

    const updatedEntity = await controller.update(createdEntity.id, {
      name: updatedName,
      stepIds: [secondOnboardingStep.id],
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity.steps.length).toEqual(2);
    expect(updatedEntity.steps.map((step) => step.id)).toEqual([
      firstOnboardingStep.id,
      secondOnboardingStep.id,
    ]);
  });

  it('update throws error when no onboarding step was found', async () => {
    await expect(
      controller.update(DEFAULT_GUID, {
        name: 'UPDATED Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding step', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
    });

    const removedEntity = await controller.remove(createdEntity.id);
    await expect(controller.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no onboarding step was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
