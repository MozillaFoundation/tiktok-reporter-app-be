import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCountryCodeDto } from 'src/countryCodes/dtos/update-country-code.dto';
import { getFakeEntityRepository } from './fake-repository.util';

const fakeCountryCodeRepository = getFakeEntityRepository<CountryCode>();

export const fakeCountryCodesService: Partial<CountryCodesService> = {
  create: async (createCountryCodeDto: CreateCountryCodeDto) => {
    const newCountryCode = {
      code: createCountryCodeDto.countryCode,
      countryName: createCountryCodeDto.countryName,
      studies: [],
    } as CountryCode;

    const createdCountryCode = fakeCountryCodeRepository.create(newCountryCode);

    const savedCountryCode = fakeCountryCodeRepository.save(createdCountryCode);

    return await savedCountryCode;
  },
  findAll: async () => {
    const studies = await fakeCountryCodeRepository.find();
    return studies;
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    if (!foundCountryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return foundCountryCode;
  },
  findAllById: async (countryCodeIds: string[]) => {
    return await fakeCountryCodeRepository.findBy({
      id: In(countryCodeIds),
    });
  },
  update: async (id: string, updateCountryCodeDto: UpdateCountryCodeDto) => {
    const foundCountryCode = await fakeCountryCodesService.findOne(id);

    Object.assign(foundCountryCode, {
      code: updateCountryCodeDto.countryCode || foundCountryCode.code,
      countryName:
        updateCountryCodeDto.countryName || foundCountryCode.countryName,
    });
    return await fakeCountryCodeRepository.save(foundCountryCode);
  },
  remove: async (id: string) => {
    const foundCountryCode = await fakeCountryCodesService.findOne(id);

    return await fakeCountryCodeRepository.remove(foundCountryCode);
  },
};
