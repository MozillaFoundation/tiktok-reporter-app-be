import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from './entities/country-code.entity';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { DEFAULT_GUID } from 'src/utils/constants';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CountryCodesService', () => {
  let service: CountryCodesService;
  let repository: Repository<CountryCode>;
  const COUNTRY_CODE_REPOSITORY_TOKEN = getRepositoryToken(CountryCode);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryCodesService,
        {
          provide: COUNTRY_CODE_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<CountryCode>() },
        },
      ],
    }).compile();

    service = module.get<CountryCodesService>(CountryCodesService);
    repository = module.get<Repository<CountryCode>>(
      COUNTRY_CODE_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Country Code';

    const createdCountryCode = await service.create(createCountryCodeDto);

    await expect(createdCountryCode).toBeDefined();
    await expect(createdCountryCode.id).toBeDefined();
    await expect(createdCountryCode.code).toEqual(
      createCountryCodeDto.countryCode,
    );
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Find All Country Codes';
    const newCreatedCountryCode = await service.create(createCountryCodeDto);

    const allCountryCodes = await service.findAll();

    await expect(allCountryCodes).toBeDefined();
    await expect(allCountryCodes.length).toBeGreaterThan(0);
    await expect(allCountryCodes).toContain(newCreatedCountryCode);
  });

  it('findAllById returns the list of studies with ids in the provided search list ', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Find All By Ids Country Codes';
    const newCreatedCountryCode = await service.create(createCountryCodeDto);

    const foundCountries = await service.findAllById([
      newCreatedCountryCode.id,
    ]);

    await expect(foundCountries).toBeDefined();
    await expect(foundCountries.length).toBeGreaterThan(0);
    await expect(foundCountries).toContain(newCreatedCountryCode);
  });

  it('findOne returns newly created country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Find One Country Code';
    const newCreatedCountryCode = await service.create(createCountryCodeDto);

    const foundCountryCode = await service.findOne(newCreatedCountryCode.id);

    await expect(foundCountryCode).toBeDefined();
    await expect(foundCountryCode).toEqual(newCreatedCountryCode);
  });

  it('findOne throws error when no country code was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated country code with all changes updated', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Update Country Code';
    const newCreatedCountryCode = await service.create(createCountryCodeDto);
    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedCountryCode = await service.update(newCreatedCountryCode.id, {
      countryCode: updatedCode,
    });

    await expect(updatedCountryCode).toBeDefined();
    await expect(updatedCountryCode.code).toEqual(updatedCode);
    await expect(updatedCountryCode).toEqual(newCreatedCountryCode);
  });

  it('update returns the updated country code with the partial changes updated', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Update Country Code';
    entityDto.countryName = 'Test Update Country Code Name';

    const newCreatedCountryCode = await service.create(entityDto);
    const updatedCode = 'UPDATED Test Update Country Code';

    const updatedCountryCode = await service.update(newCreatedCountryCode.id, {
      countryCode: updatedCode,
    });

    await expect(updatedCountryCode).toBeDefined();
    await expect(updatedCountryCode.code).toEqual(updatedCode);
    await expect(updatedCountryCode.countryName).toEqual(entityDto.countryName);
    await expect(updatedCountryCode).toEqual(newCreatedCountryCode);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Delete Country Code';
    const newCreatedCountryCode = await service.create(createCountryCodeDto);

    const removedCountryCode = await service.remove(newCreatedCountryCode.id);
    await expect(service.findOne(removedCountryCode.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no country code was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
