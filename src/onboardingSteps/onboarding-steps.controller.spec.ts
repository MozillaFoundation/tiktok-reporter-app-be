import {
  DEFAULT_GUID,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { OnboardingStepsController } from './onboarding-steps.controller';
import { OnboardingStepsService } from './onboarding-steps.service';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';

describe('OnboardingStepsController', () => {
  let controller: OnboardingStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingStepsController],
      providers: [
        {
          provide: OnboardingStepsService,
          useValue: fakeOnboardingStepsService,
        },
      ],
    }).compile();

    controller = module.get<OnboardingStepsController>(
      OnboardingStepsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created onboarding steps', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.title).toEqual(defaultCreateOnboardingStepDto.title);
    expect(createdEntity.subtitle).toEqual(
      defaultCreateOnboardingStepDto.subtitle,
    );
    expect(createdEntity.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(createdEntity.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(createdEntity.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(createdEntity.order).toEqual(defaultCreateOnboardingStepDto.order);
  });

  it('findAll returns the list of all onboarding steps including the newly created one', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findOne returns newly created onboarding step', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );

    const foundEntity = await controller.findOne(createdEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no onboarding steps was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated onboarding steps with all changes updated', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );

    const updatedTitle = 'UPDATED Test Onboarding Step Title';
    const updatedSubtitle = 'UPDATED Test Onboarding Step SubTitle';
    const updatedDescription = 'UPDATED Test Onboarding Step Description';
    const updatedImageUrl = 'UPDATED Test Onboarding Step ImageURL';
    const updatedDetails = 'UPDATED Test Onboarding Step Details';
    const updatedOrder = 2;

    const updatedEntity = await controller.update(createdEntity.id, {
      title: updatedTitle,
      subtitle: updatedSubtitle,
      description: updatedDescription,
      imageUrl: updatedImageUrl,
      details: updatedDetails,
      order: updatedOrder,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.subtitle).toEqual(updatedSubtitle);
    expect(updatedEntity.description).toEqual(updatedDescription);
    expect(updatedEntity.imageUrl).toEqual(updatedImageUrl);
    expect(updatedEntity.details).toEqual(updatedDetails);
    expect(updatedEntity.order).toEqual(updatedOrder);
    expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated onboarding step with the partial changes updated', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await controller.update(createdEntity.id, {
      title: updatedTitle,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.subtitle).toEqual(
      defaultCreateOnboardingStepDto.subtitle,
    );

    expect(updatedEntity.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(updatedEntity.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(updatedEntity.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(updatedEntity.order).toEqual(defaultCreateOnboardingStepDto.order);

    expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no onboarding step was found', async () => {
    await expect(
      controller.update(DEFAULT_GUID, {
        title: 'UPDATED Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding step', async () => {
    const createdEntity = await controller.create(
      defaultCreateOnboardingStepDto,
    );

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
