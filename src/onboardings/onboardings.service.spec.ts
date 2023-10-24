import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { Onboarding } from './entities/onboarding.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { OnboardingsService } from './onboardings.service';
import { Repository } from 'typeorm';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Form } from 'src/forms/entities/form.entity';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { FormsService } from 'src/forms/forms.service';

describe('OnboardingsService', () => {
  let service: OnboardingsService;
  let repository: Repository<Onboarding>;
  const REPOSITORY_TOKEN = getRepositoryToken(Onboarding);
  let firstOnboardingStep: OnboardingStep;
  let secondOnboardingStep: OnboardingStep;
  let firstOnboardingForm: Form;
  let secondOnboardingForm: Form;

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

    firstOnboardingForm = await fakeFormsService.create(defaultCreateFormDto);
    secondOnboardingForm = await fakeFormsService.create(defaultCreateFormDto);
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
          provide: FormsService,
          useValue: fakeFormsService,
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
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('create throws error if non existent onboarding step id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateOnboardingDto,
        stepIds: [DEFAULT_GUID],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent form id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll returns the list of all onboardings including the newly created one', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findAllById returns the list of onboardings with ids in the provided search list ', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toContain(createdEntity);
  });

  it('findOne returns newly created onboarding', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
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
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });
    const updatedName = 'UPDATED Name';

    const updatedEntity = await service.update(createdEntity.id, {
      name: updatedName,
      stepIds: [secondOnboardingStep.id],
      formId: secondOnboardingForm.id,
    });

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
      service.update(DEFAULT_GUID, {
        name: 'Updated Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error if non existent onboarding step id is provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    await expect(
      service.update(createdEntity.id, {
        name: 'Updated Name',
        stepIds: [DEFAULT_GUID],
        formId: secondOnboardingForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error if non existent form id is provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    await expect(
      service.update(createdEntity.id, {
        name: 'Updated Name',
        stepIds: [secondOnboardingStep.id],
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding', async () => {
    const createdEntity = await service.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
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
