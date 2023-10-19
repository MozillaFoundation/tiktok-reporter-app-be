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
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Country Code';
    entityDto.countryName = 'Test Country Name';

    const newEntityCode = await controller.create(entityDto);

    await expect(newEntityCode).toBeDefined();
    await expect(newEntityCode.id).toBeDefined();
    await expect(newEntityCode.code).toEqual(entityDto.countryCode);
    await expect(newEntityCode.countryName).toEqual(entityDto.countryName);
  });
  it('findAll returns the list of all country codes including the newly created one', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Find All Country Codes';
    entityDto.countryName = 'Test Find All Country Codes Name';

    const newEntityCode = await controller.create(entityDto);

    const allCountryCodes = await controller.findAll();

    await expect(allCountryCodes).toBeDefined();
    await expect(allCountryCodes.length).toBeGreaterThan(0);
    await expect(allCountryCodes).toContain(newEntityCode);
  });

  it('findOne returns newly created country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Find One Country Code';
    entityDto.countryName = 'Test Find One Country Code Name';

    const newEntityCode = await controller.create(entityDto);

    const foundCountryCode = await controller.findOne(newEntityCode.id);

    await expect(foundCountryCode).toBeDefined();
    await expect(foundCountryCode).toEqual(newEntityCode);
  });

  it('update returns the updated country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Update Country Code';
    entityDto.countryName = 'Test Update Country Code Name';

    const newEntityCode = await controller.create(entityDto);
    const updatedCode = 'UPDATED Test Country Code';
    const updatedName = 'UPDATED Test Country Code Name';

    const updatedEntity = await controller.update(newEntityCode.id, {
      countryCode: updatedCode,
      countryName: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.code).toEqual(updatedCode);
    await expect(updatedEntity.countryName).toEqual(updatedName);
    await expect(updatedEntity).toEqual(newEntityCode);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      controller.update('12', {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Delete Country Code';
    entityDto.countryName = 'Test Delete Country Code Name';

    const newCreatedCountryCode = await controller.create(entityDto);

    const removedCountryCode = await controller.remove(
      newCreatedCountryCode.id,
    );
    const foundRemovedCountryCode = await controller.findOne(
      removedCountryCode.id,
    );

    await expect(foundRemovedCountryCode).not.toBeDefined();
  });

  it('remove throws error when no country code was found', async () => {
    await expect(controller.remove('12')).rejects.toThrow(NotFoundException);
  });
});
