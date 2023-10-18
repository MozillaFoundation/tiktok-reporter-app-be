import { Test, TestingModule } from '@nestjs/testing';

import { CountryCodesController } from './country-codes.controller';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { NotFoundException } from '@nestjs/common';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';

describe('CountryCodesController', () => {
  let controller: CountryCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryCodesController],
      providers: [
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
      ],
    }).compile();

    controller = module.get<CountryCodesController>(CountryCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Country Code';

    const newCreatedCountryCode =
      await fakeCountryCodesService.create(createCountryCodeDto);

    await expect(newCreatedCountryCode).toBeDefined();
    await expect(newCreatedCountryCode.id).toBeDefined();
    await expect(newCreatedCountryCode.code).toEqual(
      createCountryCodeDto.countryCode,
    );
  });
  it('findAll returns the list of all country codes including the newly created one', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Find All Country Codes';
    const newCreatedCountryCode =
      await fakeCountryCodesService.create(createCountryCodeDto);

    const allCountryCodes = await fakeCountryCodesService.findAll();

    await expect(allCountryCodes).toBeDefined();
    await expect(allCountryCodes.length).toBeGreaterThan(0);
    await expect(allCountryCodes).toContain(newCreatedCountryCode);
  });

  it('findOne returns newly created country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Find One Country Code';
    const newCreatedCountryCode =
      await fakeCountryCodesService.create(createCountryCodeDto);

    const foundCountryCode = await fakeCountryCodesService.findOne(
      newCreatedCountryCode.id,
    );

    await expect(foundCountryCode).toBeDefined();
    await expect(foundCountryCode).toEqual(newCreatedCountryCode);
  });

  it('update returns the updated country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Update Country Code';
    const newCreatedCountryCode =
      await fakeCountryCodesService.create(createCountryCodeDto);
    const updatedCode = 'UPDATED Test Country Code';

    const updatedCountryCode = await fakeCountryCodesService.update(
      newCreatedCountryCode.id,
      {
        countryCode: updatedCode,
      },
    );

    await expect(updatedCountryCode).toBeDefined();
    await expect(updatedCountryCode.code).toEqual(updatedCode);
    await expect(updatedCountryCode).toEqual(newCreatedCountryCode);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      fakeCountryCodesService.update('12', {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const createCountryCodeDto = new CreateCountryCodeDto();
    createCountryCodeDto.countryCode = 'Test Delete Country Code';
    const newCreatedCountryCode =
      await fakeCountryCodesService.create(createCountryCodeDto);

    const removedCountryCode = await fakeCountryCodesService.remove(
      newCreatedCountryCode.id,
    );
    const foundRemovedCountryCode = await fakeCountryCodesService.findOne(
      removedCountryCode.id,
    );

    await expect(foundRemovedCountryCode).not.toBeDefined();
  });

  it('remove throws error when no country code was found', async () => {
    await expect(fakeCountryCodesService.remove('12')).rejects.toThrow(
      NotFoundException,
    );
  });
});
