import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { FormsService } from 'src/forms/forms.service';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { OnboardingsService } from './onboardings.service';
import { Repository } from 'typeorm';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OnboardingStepDto } from 'src/onboardingSteps/dtos/onboarding-step.dto';
import { FormDto } from 'src/forms/dtos/form.dto';

describe('OnboardingsService', () => {
  let service: OnboardingsService;
  let repository: Repository<Onboarding>;
  let apiKeyRepository: Repository<ApiKey>;
  let configService: ConfigService;

  const REPOSITORY_TOKEN = getRepositoryToken(Onboarding);
  const API_KEY_REPOSITORY_TOKEN = getRepositoryToken(ApiKey);

  let firstOnboardingStep: OnboardingStepDto;
  let secondOnboardingStep: OnboardingStepDto;
  let firstOnboardingForm: FormDto;
  let secondOnboardingForm: FormDto;
  let apiKey: string;

  beforeAll(async () => {
    firstOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    secondOnboardingStep = await fakeOnboardingStepsService.create(apiKey, {
      title: 'Test Second Onboarding Step Title',
      platform: null,
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
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<OnboardingsService>(OnboardingsService);
    repository = module.get<Repository<Onboarding>>(REPOSITORY_TOKEN);
    initApiKey(module);
  });

  function initApiKey(module: TestingModule) {
    apiKeyRepository = module.get<Repository<ApiKey>>(API_KEY_REPOSITORY_TOKEN);
    configService = module.get<ConfigService>(ConfigService);
    apiKey = configService.get<string>('API_KEY');

    const createdApiKey = apiKeyRepository.create({
      key: apiKey,
      appName: 'Dev Testing',
    });
    apiKeyRepository.save(createdApiKey);
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created onboarding', async () => {
    const createdEntity = await service.create(apiKey, {
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
      service.create(apiKey, {
        ...defaultCreateOnboardingDto,
        stepIds: [DEFAULT_GUID],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent form id is provided', async () => {
    await expect(
      service.create(apiKey, {
        ...defaultCreateOnboardingDto,
        stepIds: [firstOnboardingStep.id],
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll returns the list of all onboardings including the newly created one', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findAllById returns the list of onboardings with ids in the provided search list ', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created onboarding', async () => {
    const createdEntity = await service.create(apiKey, {
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
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });
    const updatedName = 'UPDATED Name';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
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
      service.update(apiKey, DEFAULT_GUID, {
        name: 'Updated Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error if non existent onboarding step id is provided', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    await expect(
      service.update(apiKey, createdEntity.id, {
        name: 'Updated Name',
        stepIds: [DEFAULT_GUID],
        formId: secondOnboardingForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error if non existent form id is provided', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstOnboardingForm.id,
    });

    await expect(
      service.update(apiKey, createdEntity.id, {
        name: 'Updated Name',
        stepIds: [secondOnboardingStep.id],
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding', async () => {
    const createdEntity = await service.create(apiKey, {
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
