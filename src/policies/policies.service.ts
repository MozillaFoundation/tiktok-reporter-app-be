import { Injectable, NotFoundException } from '@nestjs/common';
import { In, IsNull, Repository } from 'typeorm';
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

  async findAppPolicies() {
    return await this.policyRepository.find({
      where: { studies: { id: IsNull() } },
      relations: { studies: true },
    });
  }

  async findAllById(policyIds: string[]) {
    return await this.policyRepository.findBy({
      id: In(policyIds),
    });
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

  async update(id: string, updatePolicyDto: UpdatePolicyDto) {
    const foundPolicy = await this.findOne(id);

    Object.assign(foundPolicy, {
      type: updatePolicyDto.type || foundPolicy.type,
      title: updatePolicyDto.title || foundPolicy.title,
      subtitle: updatePolicyDto.subtitle || foundPolicy.subtitle,
      text: updatePolicyDto.text || foundPolicy.text,
    });

    return await this.policyRepository.save(foundPolicy);
  }

  async remove(id: string) {
    const countryCode = await this.findOne(id);

    return await this.policyRepository.remove(countryCode);
  }
}
