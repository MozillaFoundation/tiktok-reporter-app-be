import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCountryCodeDto } from 'src/countryCodes/dtos/update-country-code.dto';
import { getFakeEntityRepository } from './fake-repository.util';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapCountryCodeEntityToDto,
  mapCountryCodesToDtos,
} from 'src/countryCodes/mappers/mapEntitiiesToDto';

const fakeCountryCodeRepository = getFakeEntityRepository<CountryCode>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakeCountryCodesService: Partial<CountryCodesService> = {
  create: async (
    headerApiKey: string,
    createCountryCodeDto: CreateCountryCodeDto,
  ) => {
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const newCountryCode = {
      code: createCountryCodeDto.countryCode,
      countryName: createCountryCodeDto.countryName,
      studies: [],
      createdBy: savedApiKey,
    } as CountryCode;

    const createdCountryCode =
      await fakeCountryCodeRepository.create(newCountryCode);

    const savedCountryCode =
      await fakeCountryCodeRepository.save(createdCountryCode);

    return mapCountryCodeEntityToDto(savedCountryCode);
  },
  findAll: async () => {
    const allCountryCodes = await fakeCountryCodeRepository.find();

    return mapCountryCodesToDtos(allCountryCodes);
  },
  findOne: async (id: string) => {
    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    if (!foundCountryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return mapCountryCodeEntityToDto(foundCountryCode);
  },
  findAllById: async (countryCodeIds: string[]) => {
    const allCountryCodesById = await fakeCountryCodeRepository.findBy({
      id: In(countryCodeIds),
    });

    return mapCountryCodesToDtos(allCountryCodesById);
  },
  update: async (
    headerApiKey: string,
    id: string,
    updateCountryCodeDto: UpdateCountryCodeDto,
  ) => {
    const foundCountryCode = await fakeCountryCodesService.findOne(id);
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });
    Object.assign(foundCountryCode, {
      code: updateCountryCodeDto.countryCode || foundCountryCode.code,
      countryName:
        updateCountryCodeDto.countryName || foundCountryCode.countryName,
      updatedBy: savedApiKey,
    });
    const updatedCountryCode =
      await fakeCountryCodeRepository.save(foundCountryCode);

    return mapCountryCodeEntityToDto(updatedCountryCode);
  },
  remove: async (id: string) => {
    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    if (!foundCountryCode) {
      throw new NotFoundException('Country Code not found');
    }
    const removedCountryCode =
      await fakeCountryCodeRepository.remove(foundCountryCode);

    return mapCountryCodeEntityToDto(removedCountryCode);
  },
};

Object.assign(fakeCountryCodesService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
