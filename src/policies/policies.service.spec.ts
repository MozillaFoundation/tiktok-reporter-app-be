import { ConfigModule, ConfigService } from '@nestjs/config';
import { DEFAULT_GUID, defaultCreatePolicyDto } from 'src/utils/constants';
import { Policy, PolicyType } from './entities/policy.entity';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { NotFoundException } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let repository: Repository<Policy>;
  let apiKeyRepository: Repository<ApiKey>;
  let configService: ConfigService;

  const REPOSITORY_TOKEN = getRepositoryToken(Policy);
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
        PoliciesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<Policy>() },
        },
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
    repository = module.get<Repository<Policy>>(REPOSITORY_TOKEN);
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

  it('should have api key repository defined', () => {
    expect(apiKeyRepository).toBeDefined();
  });

  it('create returns the newly created policy', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.type).toEqual(defaultCreatePolicyDto.type);
    expect(createdEntity.title).toEqual(defaultCreatePolicyDto.title);
    expect(createdEntity.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(createdEntity.text).toEqual(defaultCreatePolicyDto.text);
    expect(createdEntity['createdAt']).toBeDefined();
    expect(createdEntity['updatedAt']).toBeDefined();
  });

  it('findAll returns the list of all policies including the newly created one', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findAppPolicies returns the list of all policies not related to a study', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    const allEntities = await service.findAppPolicies();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findAllById returns the list of policies with ids in the provided search list ', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created policy', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no policy was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated policy with all changes updated', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);
    const updatedType = PolicyType.PrivacyPolicy;
    const updatedTitle = 'UPDATED Title';
    const updatedSubtitle = 'UPDATED Subtitle';
    const updatedText = 'UPDATED Text';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      type: updatedType,
      title: updatedTitle,
      subtitle: updatedSubtitle,
      text: updatedText,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.type).toEqual(updatedType);
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.subtitle).toEqual(updatedSubtitle);
    expect(updatedEntity.text).toEqual(updatedText);
  });

  it('update returns the updated policy with the partial changes updated', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      title: updatedTitle,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.type).toEqual(defaultCreatePolicyDto.type);
    expect(updatedEntity.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(updatedEntity.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('update throws error when no policy was found', async () => {
    await expect(
      service.update(apiKey, DEFAULT_GUID, {
        title: 'Updated Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the policy', async () => {
    const createdEntity = await service.create(apiKey, defaultCreatePolicyDto);

    const removedEntity = await service.remove(createdEntity.id);

    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no policy was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
