import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryCode } from './entities/country-code.entity';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { UpdateCountryCodeDto } from './dtos/update-country-code.dto';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapCountryCodeEntityToDto,
  mapCountryCodesToDtos,
} from './mappers/mapEntitiiesToDto';

@Injectable()
export class CountryCodesService {
  constructor(
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(
    headerApiKey: string,
    createCountryCodeDto: CreateCountryCodeDto,
  ) {
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdCountryCode = this.countryCodeRepository.create({
      countryName: createCountryCodeDto.countryName,
      code: createCountryCodeDto.countryCode,
      createdBy: savedApiKey,
    });

    const savedCountryCode =
      await this.countryCodeRepository.save(createdCountryCode);

    return mapCountryCodeEntityToDto(savedCountryCode);
  }

  async findAll() {
    const allCountryCodes = await this.countryCodeRepository.find();

    return mapCountryCodesToDtos(allCountryCodes);
  }

  async findAllById(countryCodeIds: string[]) {
    const allCountryCodesById = await this.countryCodeRepository.findBy({
      id: In(countryCodeIds),
    });

    return mapCountryCodesToDtos(allCountryCodesById);
  }

  async findOne(id: string) {
    const countryCode = await this.countryCodeRepository.findOneBy({ id });

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return mapCountryCodeEntityToDto(countryCode);
  }

  async update(
    headerApiKey: string,
    id: string,
    updateCountryCodeDto: UpdateCountryCodeDto,
  ) {
    const countryCode = await this.findOne(id);

    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(countryCode, {
      countryName: updateCountryCodeDto.countryName || countryCode.countryName,
      code: updateCountryCodeDto.countryCode || countryCode.code,
      updatedBy: savedApiKey,
    });

    const updatedCountryCode =
      await this.countryCodeRepository.save(countryCode);

    return mapCountryCodeEntityToDto(updatedCountryCode);
  }

  async remove(id: string) {
    const countryCode = await this.countryCodeRepository.findOneBy({ id });

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    const removedCountryCode =
      await this.countryCodeRepository.remove(countryCode);

    return mapCountryCodeEntityToDto(removedCountryCode);
  }
}
