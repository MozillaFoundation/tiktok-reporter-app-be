import { DEFAULT_GUID, defaultCreateCountryCodeDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from './entities/country-code.entity';
import { CountryCodesService } from './country-codes.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.spec.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CountryCodesService', () => {
  let service: CountryCodesService;
  let repository: Repository<CountryCode>;
  const REPOSITORY_TOKEN = getRepositoryToken(CountryCode);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryCodesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<CountryCode>() },
        },
      ],
    }).compile();

    service = module.get<CountryCodesService>(CountryCodesService);
    repository = module.get<Repository<CountryCode>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created country code', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.code).toEqual(
      defaultCreateCountryCodeDto.countryCode,
    );
  });

  it('findAll returns the list of all country codes including the newly created one', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

    const allEntities = await service.findAll();

    await expect(allEntities).toBeDefined();
    await expect(allEntities.length).toBeGreaterThan(0);
    await expect(allEntities).toContain(createdEntity);
  });

  it('findAllById returns the list of country codes with ids in the provided search list ', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

    const foundEntity = await service.findAllById([createdEntity.id]);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity.length).toBeGreaterThan(0);
    await expect(foundEntity).toContain(createdEntity);
  });

  it('findOne returns newly created country code', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

    const foundEntity = await service.findOne(createdEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no country code was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated country code with all changes updated', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedEntity = await service.update(createdEntity.id, {
      countryCode: updatedCode,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.code).toEqual(updatedCode);
    await expect(updatedEntity.countryName).toEqual(
      defaultCreateCountryCodeDto.countryName,
    );
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated country code with the partial changes updated', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);
    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedEntity = await service.update(createdEntity.id, {
      countryCode: updatedCode,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.code).toEqual(updatedCode);
    await expect(updatedEntity.countryName).toEqual(
      defaultCreateCountryCodeDto.countryName,
    );
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const createdEntity = await service.create(defaultCreateCountryCodeDto);

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
