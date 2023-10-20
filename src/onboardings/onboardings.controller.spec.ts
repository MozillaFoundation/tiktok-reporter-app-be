import { DEFAULT_GUID, defaultCreateOnboardingDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { OnboardingsController } from './onboardings.controller';
import { OnboardingsService } from './onboardings.service';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.spec.util';

describe('OnboardingsController', () => {
  let controller: OnboardingsController;

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
    const createdEntity = await controller.create(defaultCreateOnboardingDto);

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('findAll returns the list of all onboarding steps including the newly created one', async () => {
    const createdEntity = await controller.create(defaultCreateOnboardingDto);

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findOne returns newly created onboarding step', async () => {
    const createdEntity = await controller.create(defaultCreateOnboardingDto);

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
    const createdEntity = await controller.create(defaultCreateOnboardingDto);

    const updatedName = 'UPDATED Name';

    const updatedEntity = await controller.update(createdEntity.id, {
      name: updatedName,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no onboarding step was found', async () => {
    await expect(
      controller.update(DEFAULT_GUID, {
        name: 'UPDATED Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding step', async () => {
    const createdEntity = await controller.create(defaultCreateOnboardingDto);

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
