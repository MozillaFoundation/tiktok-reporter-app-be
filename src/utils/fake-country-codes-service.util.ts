import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateCountryCodeDto } from 'src/countryCodes/dtos/update-country-code.dto';
import { getFakeEntityRepository } from './fake-repository.util';

const fakeCountryCodeRepository = getFakeEntityRepository<CountryCode>();

export const fakeCountryCodesService: Partial<CountryCodesService> = {
  create: async (createCountryCodeDto: CreateCountryCodeDto) => {
    const newCountryCode = {
      code: createCountryCodeDto.countryCode,
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
    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    return foundCountryCode;
  },
  update: async (id: string, updateCountryCodeDto: UpdateCountryCodeDto) => {
    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    if (!foundCountryCode) {
      throw new NotFoundException('CountryCode not found');
    }

    Object.assign(foundCountryCode, { code: updateCountryCodeDto.countryCode });
    return await fakeCountryCodeRepository.save(foundCountryCode);
  },
  remove: async (id: string) => {
    const foundCountryCode = await fakeCountryCodeRepository.findOneBy({ id });

    if (!foundCountryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return await fakeCountryCodeRepository.remove(foundCountryCode);
  },
};
