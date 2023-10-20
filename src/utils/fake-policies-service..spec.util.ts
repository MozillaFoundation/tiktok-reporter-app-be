import { In, IsNull } from 'typeorm';

import { CreatePolicyDto } from 'src/policies/dtos/create-policy.dto';
import { NotFoundException } from '@nestjs/common';
import { PoliciesService } from 'src/policies/policies.service';
import { Policy } from 'src/policies/entities/policy.entity';
import { UpdatePolicyDto } from 'src/policies/dtos/update-policy.dto';
import { getFakeEntityRepository } from './fake-repository.spec.util';

const fakePolicyRepository = getFakeEntityRepository<Policy>();

export const fakePoliciesService: Partial<PoliciesService> = {
  create: async (createPolicyDto: CreatePolicyDto) => {
    const newPolicyDto = {
      type: createPolicyDto.type,
      title: createPolicyDto.title,
      subtitle: createPolicyDto.subtitle,
      text: createPolicyDto.text,
      studies: [],
    } as Policy;

    const createdPolicy = fakePolicyRepository.create(newPolicyDto);

    const savedPolicy = fakePolicyRepository.save(createdPolicy);

    return await savedPolicy;
  },
  findAll: async () => {
    return await fakePolicyRepository.find();
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundPolicy = await fakePolicyRepository.findOneBy({ id });

    if (!foundPolicy) {
      throw new NotFoundException('Policy was not found');
    }

    return foundPolicy;
  },
  findAppPolicies: async () => {
    return await fakePolicyRepository.find({
      where: { studies: { id: IsNull() } },
      relations: { studies: true },
    });
  },
  findAllById: async (policyIds: string[]) => {
    return await fakePolicyRepository.findBy({
      id: In(policyIds),
    });
  },
  update: async (id: string, updatePolicyDto: UpdatePolicyDto) => {
    const foundPolicy = await fakePoliciesService.findOne(id);

    Object.assign(foundPolicy, {
      type: updatePolicyDto.type || foundPolicy.type,
      title: updatePolicyDto.title || foundPolicy.title,
      subtitle: updatePolicyDto.subtitle || foundPolicy.subtitle,
      text: updatePolicyDto.text || foundPolicy.text,
    });
    return await fakePolicyRepository.save(foundPolicy);
  },
  remove: async (id: string) => {
    const foundPolicy = await fakePoliciesService.findOne(id);

    return await fakePolicyRepository.remove(foundPolicy);
  },
};
