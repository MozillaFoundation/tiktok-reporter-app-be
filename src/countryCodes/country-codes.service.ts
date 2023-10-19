import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  async create(createCountryCodeDto: CreateCountryCodeDto) {
    const createdCountryCode = this.countryCodeRepository.create({
      countryName: createCountryCodeDto.countryName,
      code: createCountryCodeDto.countryCode,
    });

    return await this.countryCodeRepository.save(createdCountryCode);
  }

  async findAll() {
    return await this.countryCodeRepository.find();
  }

  async findAllById(countryCodeIds: string[]) {
    return await this.countryCodeRepository.findBy({
      id: In(countryCodeIds),
    });
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    return await this.countryCodeRepository.findOneBy({ id });
  }

  async update(id: string, updateCountryCodeDto: UpdateCountryCodeDto) {
    const countryCode = await this.findOne(id);

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    Object.assign(countryCode, {
      countryName: updateCountryCodeDto.countryName,
      code: updateCountryCodeDto.countryCode,
    });
    return await this.countryCodeRepository.save(countryCode);
  }

  async remove(id: string) {
    const countryCode = await this.findOne(id);

    if (!countryCode) {
      throw new NotFoundException('Country Code not found');
    }

    return await this.countryCodeRepository.remove(countryCode);
  }
}
