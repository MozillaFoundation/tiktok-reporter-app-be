import { In, IsNull } from 'typeorm';

import { CreatePolicyDto } from 'src/policies/dtos/create-policy.dto';
import { NotFoundException } from '@nestjs/common';
import { PoliciesService } from 'src/policies/policies.service';
import { Policy } from 'src/policies/entities/policy.entity';
import { UpdatePolicyDto } from 'src/policies/dtos/update-policy.dto';
import { getFakeEntityRepository } from './fake-repository.util';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapPoliciesToDtos,
  mapPolicyEntityToDto,
} from 'src/policies/mappers/mapEntitiesToDto';

const fakePolicyRepository = getFakeEntityRepository<Policy>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakePoliciesService: Partial<PoliciesService> = {
  create: async (headerApiKey: string, createPolicyDto: CreatePolicyDto) => {
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const newPolicyDto = {
      type: createPolicyDto.type,
      title: createPolicyDto.title,
      subtitle: createPolicyDto.subtitle,
      text: createPolicyDto.text,
      studies: [],
      createdBy: savedApiKey,
    } as Policy;

    const createdPolicy = await fakePolicyRepository.create(newPolicyDto);

    const savedPolicy = await fakePolicyRepository.save(createdPolicy);

    return mapPolicyEntityToDto(savedPolicy);
  },

  findAll: async () => {
    const allPolicies = await fakePolicyRepository.find();

    return mapPoliciesToDtos(allPolicies);
  },

  findOne: async (id: string) => {
    const foundPolicy = await fakePolicyRepository.findOneBy({ id });

    if (!foundPolicy) {
      throw new NotFoundException('Policy was not found');
    }

    return mapPolicyEntityToDto(foundPolicy);
  },

  findAppPolicies: async () => {
    const appPolicies = await fakePolicyRepository.find({
      where: { studies: { id: IsNull() } },
      relations: { studies: true },
    });

    return mapPoliciesToDtos(appPolicies);
  },

  findAllById: async (policyIds: string[]) => {
    const allPoliciesById = await fakePolicyRepository.findBy({
      id: In(policyIds),
    });

    return mapPoliciesToDtos(allPoliciesById);
  },

  update: async (
    headerApiKey: string,
    id: string,
    updatePolicyDto: UpdatePolicyDto,
  ) => {
    const foundPolicy = await fakePoliciesService.findOne(id);
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(foundPolicy, {
      type: updatePolicyDto.type || foundPolicy.type,
      title: updatePolicyDto.title || foundPolicy.title,
      subtitle: updatePolicyDto.subtitle || foundPolicy.subtitle,
      text: updatePolicyDto.text || foundPolicy.text,
      updatedBy: savedApiKey,
    });
    const updatedPolicy = await fakePolicyRepository.save(foundPolicy);

    return mapPolicyEntityToDto(updatedPolicy);
  },

  remove: async (id: string) => {
    const foundPolicy = await fakePolicyRepository.findOneBy({ id });

    if (!foundPolicy) {
      throw new NotFoundException('Policy was not found');
    }

    const removedPolicy = await fakePolicyRepository.remove(foundPolicy);

    return mapPolicyEntityToDto(removedPolicy);
  },
};

Object.assign(fakePoliciesService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
