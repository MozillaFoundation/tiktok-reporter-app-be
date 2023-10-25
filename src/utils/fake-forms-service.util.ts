import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateFormDto } from 'src/forms/dtos/create-form.dto';
import { Form } from 'src/forms/entities/form.entity';
import { FormsService } from 'src/forms/forms.service';
import { getFakeEntityRepository } from './fake-repository.util';
import { isFilledArray } from './isFilledArray';
import { mapFormFields } from 'src/forms/mappers/form-fields.mapper';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapFormEntityToDto,
  mapFormsToDtos,
} from 'src/forms/mappers/mapEntitiesToDto';

const fakeFormRepository = getFakeEntityRepository<Form>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakeFormsService: Partial<FormsService> = {
  create: async (headerApiKey: string, createFormDto: CreateFormDto) => {
    const mappedFields = mapFormFields(createFormDto.fields);

    if (!isFilledArray(mappedFields)) {
      throw new BadRequestException(
        'The form must include at least one field.',
      );
    }

    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdForm = fakeFormRepository.create({
      name: createFormDto.name,
      fields: mappedFields,
      createdBy: savedApiKey,
    });

    const savedForm = await fakeFormRepository.save(createdForm);

    return mapFormEntityToDto(savedForm);
  },
  findAll: async () => {
    const allForms = await fakeFormRepository.find();

    return mapFormsToDtos(allForms);
  },
  findOne: async (id: string) => {
    const foundForm = await fakeFormRepository.findOneBy({ id });

    if (!foundForm) {
      throw new NotFoundException('Form was not found');
    }

    return mapFormEntityToDto(foundForm);
  },

  // update: async (id: string, updatePolicyDto: UpdateFormDto) => {
  //   const foundForm = await fakeFormsService.findOne(id);

  //   Object.assign(foundForm, {
  //     type: updatePolicyDto.type || foundForm.type,
  //     title: updatePolicyDto.title || foundForm.title,
  //     subtitle: updatePolicyDto.subtitle || foundForm.subtitle,
  //     text: updatePolicyDto.text || foundForm.text,
  //   });
  //   return await fakeFormRepository.save(foundForm);
  // },
  remove: async (id: string) => {
    const foundForm = await fakeFormRepository.findOneBy({ id });

    if (!foundForm) {
      throw new NotFoundException('Form was not found');
    }
    const removedForm = await fakeFormRepository.remove(foundForm);

    return mapFormEntityToDto(removedForm);
  },
};

Object.assign(fakeFormsService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
