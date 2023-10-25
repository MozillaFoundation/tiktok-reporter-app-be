import { DEFAULT_GUID, defaultCreateCountryCodeDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from './entities/country-code.entity';
import { CountryCodesService } from './country-codes.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('CountryCodesService', () => {
  let service: CountryCodesService;
  let repository: Repository<CountryCode>;
  let apiKeyRepository: Repository<ApiKey>;
  let configService: ConfigService;

  const REPOSITORY_TOKEN = getRepositoryToken(CountryCode);
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
        CountryCodesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<CountryCode>() },
        },
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<CountryCodesService>(CountryCodesService);
    repository = module.get<Repository<CountryCode>>(REPOSITORY_TOKEN);
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

  it('create returns the newly created country code', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.code).toEqual(defaultCreateCountryCodeDto.countryCode);
  });

  it('findAll returns the list of all country codes including the newly created one', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);

    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findAllById returns the list of country codes with ids in the provided search list ', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created country code', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no country code was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated country code with all changes updated', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      countryCode: updatedCode,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.code).toEqual(updatedCode);
    expect(updatedEntity.countryName).toEqual(
      defaultCreateCountryCodeDto.countryName,
    );
  });

  it('update returns the updated country code with the partial changes updated', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );
    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      countryCode: updatedCode,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.code).toEqual(updatedCode);
    expect(updatedEntity.countryName).toEqual(
      defaultCreateCountryCodeDto.countryName,
    );
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      service.update(apiKey, DEFAULT_GUID, {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const createdEntity = await service.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );

    const removedEntity = await service.remove(createdEntity.id);
    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no country code was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
