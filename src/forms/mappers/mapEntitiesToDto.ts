import { isFilledArray } from 'src/utils/isFilledArray';
import { mapStudiesToDtos } from 'src/studies/mappers/mapEntitiesToDto';
import { FormDto } from '../dtos/form.dto';
import { Form } from '../entities/form.entity';
import { mapOnboardingsToDtos } from 'src/onboardings/mappers/mapEntitiesToDto';

export function mapFormsToDtos(forms: Array<Form>): Array<FormDto> {
  if (!isFilledArray(forms)) {
    return [];
  }
  const formDtos = [];
  for (const form of forms) {
    formDtos.push(mapFormEntityToDto(form));
  }

  return formDtos;
}

export function mapFormEntityToDto(form: Form): FormDto {
  if (!form) {
    return null;
  }
  return {
    id: form.id,
    name: form.name,
    fields: form.fields,
    onboardings: mapOnboardingsToDtos(form.onboardings),
    studies: mapStudiesToDtos(form.studies),
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  } as FormDto;
}
