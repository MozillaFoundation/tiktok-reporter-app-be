import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Policy } from './entities/policy.entity';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
  ) {}

  async create(createCountryCodeDto: CreatePolicyDto) {
    const createdPolicy = this.policyRepository.create({
      type: createCountryCodeDto.type,
      title: createCountryCodeDto.title,
      subtitle: createCountryCodeDto.subtitle,
      text: createCountryCodeDto.text,
    });

    return await this.policyRepository.save(createdPolicy);
  }

  async findAll() {
    return await this.policyRepository.find();
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    const policy = await this.policyRepository.findOneBy({ id });

    if (!policy) {
      throw new NotFoundException('Policy was not found');
    }

    return policy;
  }

  async update(id: string, updateCountryCodeDto: UpdatePolicyDto) {
    const countryCode = await this.findOne(id);

    Object.assign(countryCode, {
      type: updateCountryCodeDto.type || countryCode.type,
      title: updateCountryCodeDto.title || countryCode.title,
      subtitle: updateCountryCodeDto.subtitle || countryCode.subtitle,
      text: updateCountryCodeDto.text || countryCode.text,
    });

    return await this.policyRepository.save(countryCode);
  }

  async remove(id: string) {
    const countryCode = await this.findOne(id);

    return await this.policyRepository.remove(countryCode);
  }
}
