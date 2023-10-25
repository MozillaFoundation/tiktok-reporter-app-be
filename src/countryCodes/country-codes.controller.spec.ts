import { Test, TestingModule } from '@nestjs/testing';

import { CountryCodesController } from './country-codes.controller';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { API_KEY_HEADER_VALUE, DEFAULT_GUID } from 'src/utils/constants';
import { NotFoundException } from '@nestjs/common';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('CountryCodesController', () => {
  let controller: CountryCodesController;
  let configService: ConfigService;
  let apiKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      controllers: [CountryCodesController],
      providers: [
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
      ],
    }).compile();

    controller = module.get<CountryCodesController>(CountryCodesController);
    configService = module.get<ConfigService>(ConfigService);
    const countryCodesService =
      module.get<CountryCodesService>(CountryCodesService);
    await countryCodesService?.['initApiKey']();

    apiKey = configService.get<string>('API_KEY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Country Code';
    entityDto.countryName = 'Test Country Name';

    const newEntityCode = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );

    expect(newEntityCode).toBeDefined();
    expect(newEntityCode.id).toBeDefined();
    expect(newEntityCode.code).toEqual(entityDto.countryCode);
    expect(newEntityCode.countryName).toEqual(entityDto.countryName);
  });

  it('findAll returns the list of all country codes including the newly created one', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Find All Country Codes';
    entityDto.countryName = 'Test Find All Country Codes Name';

    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);

    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Find One Country Code';
    entityDto.countryName = 'Test Find One Country Code Name';

    const newEntityCode = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );

    const foundEntity = await controller.findOne(newEntityCode.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(newEntityCode);
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

    const newEntityCode = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );
    const updatedCode = 'UPDATED Test Country Code';
    const updatedName = 'UPDATED Test Country Code Name';

    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      newEntityCode.id,
      {
        countryCode: updatedCode,
        countryName: updatedName,
      },
    );

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.code).toEqual(updatedCode);
    expect(updatedEntity.countryName).toEqual(updatedName);
  });

  it('update returns the updated country code with the partial changes updated', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Update Country Code';
    entityDto.countryName = 'Test Update Country Code Name';

    const newEntityCode = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );
    const updatedCode = 'UPDATED Test Country Code';

    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      newEntityCode.id,
      {
        countryCode: updatedCode,
      },
    );

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.code).toEqual(updatedCode);
    expect(updatedEntity.countryName).toEqual(entityDto.countryName);
  });

  it('update throws error when no country code was found', async () => {
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, DEFAULT_GUID, {
        countryCode: 'Not Existing Country Code',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the country code', async () => {
    const entityDto = new CreateCountryCodeDto();
    entityDto.countryCode = 'Test Delete Country Code';
    entityDto.countryName = 'Test Delete Country Code Name';

    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );

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
