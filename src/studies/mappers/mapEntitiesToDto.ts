import { isFilledArray } from 'src/utils/isFilledArray';
import { Study } from '../entities/study.entity';
import { StudyDto } from '../dto/study.dto';
import { mapCountryCodesToDtos } from 'src/countryCodes/mappers/mapEntitiiesToDto';
import { mapPoliciesToDtos } from 'src/policies/mappers/mapEntitiesToDto';
import { mapOnboardingEntityToDto } from 'src/onboardings/mappers/mapEntitiesToDto';
import { mapFormEntityToDto } from 'src/forms/mappers/mapEntitiesToDto';

export function mapStudiesToDtos(studies: Array<Study>): Array<StudyDto> {
  if (!isFilledArray(studies)) {
    return [];
  }

  const studyDtos = [];
  for (const study of studies) {
    studyDtos.push(mapStudyEntityToDto(study));
  }

  return studyDtos;
}

export function mapStudyEntityToDto(study: Study): StudyDto {
  if (!study) {
    return null;
  }

  return {
    id: study.id,
    name: study.name,
    description: study.description,
    isActive: study.isActive,
    countryCodes: mapCountryCodesToDtos(study.countryCodes),
    policies: mapPoliciesToDtos(study.policies),
    onboarding: mapOnboardingEntityToDto(study.onboarding),
    form: mapFormEntityToDto(study.form),
    createdAt: study.createdAt,
    updatedAt: study.updatedAt,
  } as StudyDto;
}
