import { Test, TestingModule } from '@nestjs/testing';

import { CountryCodesController } from './country-codes.controller';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { DEFAULT_GUID } from 'src/utils/constants';
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

    const allEntities = await controller.findAll();

    await expect(allEntities).toBeDefined();
    await expect(allEntities.length).toBeGreaterThan(0);
    await expect(allEntities).toContain(newEntityCode);
  });

  it('findOne returns newly created country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Find One Country Code';
    entityDto.countryName = 'Test Find One Country Code Name';

    const newEntityCode = await controller.create(entityDto);

    const foundEntity = await controller.findOne(newEntityCode.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(newEntityCode);
  });

  it('findOne throws error when no country code was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated country code with all changes updated', async () => {
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

  it('update returns the updated country code with the partial changes updated', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Update Country Code';
    entityDto.countryName = 'Test Update Country Code Name';

    const newEntityCode = await controller.create(entityDto);
    const updatedCode = 'UPDATED Test Country Code';

    const updatedEntity = await controller.update(newEntityCode.id, {
      countryCode: updatedCode,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.code).toEqual(updatedCode);
    await expect(updatedEntity.countryName).toEqual(entityDto.countryName);
    await expect(updatedEntity).toEqual(newEntityCode);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      controller.update(DEFAULT_GUID, {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Delete Country Code';
    entityDto.countryName = 'Test Delete Country Code Name';

    const createdEntity = await controller.create(entityDto);

    const removedCountryCode = await controller.remove(createdEntity.id);
    await expect(controller.findOne(removedCountryCode.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no country code was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
