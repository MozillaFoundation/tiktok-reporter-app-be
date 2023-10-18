import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryCode } from './entities/country-code.entity';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { UpdateCountryCodeDto } from './dtos/update-country-code.dto';

@Injectable()
export class CountryCodesService {
  constructor(
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
  ) {}

  create(createCountryCodeDto: CreateCountryCodeDto) {
    const createdCountryCode = this.countryCodeRepository.create({
      code: createCountryCodeDto.countryCode,
    });

    return this.countryCodeRepository.save(createdCountryCode);
  }

  findAll() {
    return this.countryCodeRepository.find();
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }

    return this.countryCodeRepository.findOneBy({ id });
  }

  async update(id: string, updateCountryCodeDto: UpdateCountryCodeDto) {
    const countryCode = await this.findOne(id);

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    Object.assign(countryCode, { code: updateCountryCodeDto.countryCode });
    return this.countryCodeRepository.save(countryCode);
  }

  async remove(id: string) {
    const countryCode = await this.findOne(id);

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return this.countryCodeRepository.remove(countryCode);
  }
}
