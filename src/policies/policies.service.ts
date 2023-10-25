import { Injectable, NotFoundException } from '@nestjs/common';
import { In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Policy } from './entities/policy.entity';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapPoliciesToDtos,
  mapPolicyEntityToDto,
} from './mappers/mapEntitiesToDto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(headerApiKey: string, createCountryCodeDto: CreatePolicyDto) {
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdPolicy = this.policyRepository.create({
      type: createCountryCodeDto.type,
      title: createCountryCodeDto.title,
      subtitle: createCountryCodeDto.subtitle,
      text: createCountryCodeDto.text,
      createdBy: savedApiKey,
    });

    const savedPolicy = await this.policyRepository.save(createdPolicy);

    return mapPolicyEntityToDto(savedPolicy);
  }

  async findAll() {
    const allPolicies = await this.policyRepository.find();

    return mapPoliciesToDtos(allPolicies);
  }

  async findAppPolicies() {
    const appPolicies = await this.policyRepository.find({
      where: { studies: { id: IsNull() } },
      relations: { studies: true },
    });

    return mapPoliciesToDtos(appPolicies);
  }

  async findAllById(policyIds: string[]) {
    const allPoliciesById = await this.policyRepository.findBy({
      id: In(policyIds),
    });

    return mapPoliciesToDtos(allPoliciesById);
  }

  async findOne(id: string) {
    const policy = await this.policyRepository.findOneBy({ id });

    if (!policy) {
      throw new NotFoundException('Policy was not found');
    }

    return mapPolicyEntityToDto(policy);
  }

  async update(
    headerApiKey: string,
    id: string,
    updatePolicyDto: UpdatePolicyDto,
  ) {
    const foundPolicy = await this.findOne(id);
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(foundPolicy, {
      type: updatePolicyDto.type || foundPolicy.type,
      title: updatePolicyDto.title || foundPolicy.title,
      subtitle: updatePolicyDto.subtitle || foundPolicy.subtitle,
      text: updatePolicyDto.text || foundPolicy.text,
      updatedBy: savedApiKey,
    });

    const updatedPolicy = await this.policyRepository.save(foundPolicy);

    return mapPolicyEntityToDto(updatedPolicy);
  }

  async remove(id: string) {
    const policy = await this.policyRepository.findOneBy({ id });

    if (!policy) {
      throw new NotFoundException('Policy was not found');
    }

    const removedPolicy = await this.policyRepository.remove(policy);

    return mapPolicyEntityToDto(removedPolicy);
  }
}
