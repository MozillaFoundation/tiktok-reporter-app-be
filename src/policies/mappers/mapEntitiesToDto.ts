import { mapStudiesToDtos } from 'src/studies/mappers/mapEntitiesToDto';
import { Policy } from '../entities/policy.entity';
import { isFilledArray } from 'src/utils/isFilledArray';
import { PolicyDto } from '../dtos/policy.dto';

export function mapPoliciesToDtos(policies: Array<Policy>): Array<PolicyDto> {
  if (!isFilledArray(policies)) {
    return [];
  }
  const policyDtos = [];
  for (const policy of policies) {
    policyDtos.push(mapPolicyEntityToDto(policy));
  }

  return policyDtos;
}

export function mapPolicyEntityToDto(policy: Policy): PolicyDto {
  if (!policy) {
    return null;
  }

  return {
    id: policy.id,
    type: policy.type,
    title: policy.title,
    subtitle: policy.subtitle,
    text: policy.text,
    studies: mapStudiesToDtos(policy.studies),
    createdAt: policy.createdAt,
    updatedAt: policy.updatedAt,
  } as PolicyDto;
}
