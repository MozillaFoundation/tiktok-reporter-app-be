import {
  DEFAULT_GUID,
  defaultCreateOnboardingStepDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { OnboardingStep } from './entities/onboarding-step.entity';
import { OnboardingStepsService } from './onboarding-steps.service';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('OnboardingStepsService', () => {
  let service: OnboardingStepsService;
  let repository: Repository<OnboardingStep>;
  let apiKeyRepository: Repository<ApiKey>;
  let configService: ConfigService;

  const REPOSITORY_TOKEN = getRepositoryToken(OnboardingStep);
  const API_KEY_REPOSITORY_TOKEN = getRepositoryToken(ApiKey);

  let apiKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        OnboardingStepsService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<OnboardingStep>() },
        },
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<OnboardingStepsService>(OnboardingStepsService);
    repository = module.get<Repository<OnboardingStep>>(REPOSITORY_TOKEN);
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

  it('create returns the newly created onboarding step', async () => {
    const createdEntity = await service.create(
      apiKey,
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
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findAllById returns the list of onboarding steps with ids in the provided search list ', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);

    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created onboarding step', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no onboarding step was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated onboarding step with all changes updated', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );
    const updatedTitle = 'UPDATED Test Onboarding Step Title';
    const updatedSubtitle = 'UPDATED Test Onboarding Step SubTitle';
    const updatedDescription = 'UPDATED Test Onboarding Step Description';
    const updatedImageUrl = 'UPDATED Test Onboarding Step ImageURL';
    const updatedDetails = 'UPDATED Test Onboarding Step Details';
    const updatedOrder = 2;

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
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
  });

  it('update returns the updated onboarding step with the partial changes updated', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
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
  });

  it('update throws error when no onboarding step was found', async () => {
    await expect(
      service.update(apiKey, DEFAULT_GUID, {
        title: 'Updated Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the onboarding step', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    const removedEntity = await service.remove(createdEntity.id);

    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no onboarding step was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
