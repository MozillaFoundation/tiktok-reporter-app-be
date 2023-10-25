import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  API_KEY_HEADER_VALUE,
  DEFAULT_GUID,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { OnboardingsController } from './onboardings.controller';
import { OnboardingsService } from './onboardings.service';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FormDto } from 'src/forms/dtos/form.dto';
import { OnboardingStepDto } from 'src/onboardingSteps/dtos/onboarding-step.dto';

describe('OnboardingsController', () => {
  let controller: OnboardingsController;
  let configService: ConfigService;
  let apiKey: string;
  let firstOnboardingStep: OnboardingStepDto;
  let secondOnboardingStep: OnboardingStepDto;
  let firstOnboardingForm: FormDto;
  let secondOnboardingForm: FormDto;

  beforeAll(async () => {
    firstOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    secondOnboardingStep = await fakeOnboardingStepsService.create(apiKey, {
      title: 'Test Second Onboarding Step Title',
      subtitle: 'Test Second Onboarding Step SubTitle',
      description: 'Test Second Onboarding Step Description',
      imageUrl: 'Test Second Onboarding Step ImageURL',
      details: 'Test Second Onboarding Step Details',
      order: 2,
    });
    firstOnboardingForm = await fakeFormsService.create(
      apiKey,
      defaultCreateFormDto,
    );
    secondOnboardingForm = await fakeFormsService.create(
      apiKey,
      defaultCreateFormDto,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      controllers: [OnboardingsController],
      providers: [
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
      ],
    }).compile();

    controller = module.get<OnboardingsController>(OnboardingsController);
    configService = module.get<ConfigService>(ConfigService);
    const onboardingsService =
      module.get<OnboardingsService>(OnboardingsService);
    await onboardingsService?.['initApiKey']();

    apiKey = configService.get<string>('API_KEY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created onboarding step', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('create throws error if non existent onboarding step id is provided', async () => {
    await expect(
      controller.create(
        { [API_KEY_HEADER_VALUE]: apiKey },
        {
          ...defaultCreateOnboardingDto,
          stepIds: [DEFAULT_GUID],
          formId: firstOnboardingForm.id,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll returns the list of all onboarding steps including the newly created one', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created onboarding step', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

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
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

    const updatedName = 'UPDATED Name';

    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      createdEntity.id,
      {
        name: updatedName,
        stepIds: [secondOnboardingStep.id],
        formId: secondOnboardingForm.id,
      },
    );

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity.steps.length).toEqual(2);
    expect(updatedEntity.steps.map((step) => step.id)).toEqual([
      firstOnboardingStep.id,
      secondOnboardingStep.id,
    ]);
    expect(updatedEntity.form.id).toEqual(secondOnboardingForm.id);
  });

  it('update throws error when no onboarding was found', async () => {
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, DEFAULT_GUID, {
        name: 'Updated Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error if non existent onboarding step id is provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: 'Updated Name',
        stepIds: [DEFAULT_GUID],
        formId: secondOnboardingForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error if non existent form id is provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
    );

    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: 'Updated Name',
        stepIds: [secondOnboardingStep.id],
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding step', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingForm.id,
      },
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
