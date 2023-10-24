import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getFakeEntityRepository } from './fake-repository.util';
import { FormsService } from 'src/forms/forms.service';
import { CreateFormDto } from 'src/forms/dtos/create-form.dto';
import { Form } from 'src/forms/entities/form.entity';
import { mapFormFields } from 'src/forms/mappers/form-fields.mapper';
import { isEmpty } from 'class-validator';

const fakeFormRepository = getFakeEntityRepository<Form>();

export const fakeFormsService: Partial<FormsService> = {
  create: async (createFormDto: CreateFormDto) => {
    const mappedFields = mapFormFields(createFormDto.fields);

    if (isEmpty(mappedFields)) {
      throw new BadRequestException(
        'The form must include at least one field.',
      );
    }

    const createdForm = fakeFormRepository.create({
      name: createFormDto.name,
      fields: mappedFields,
    });

    const savedForm = fakeFormRepository.save(createdForm);

    return await savedForm;
  },
  findAll: async () => {
    return await fakeFormRepository.find();
  },
  findOne: async (id: string) => {
    if (!id) {
      return null;
    }

    const foundForm = await fakeFormRepository.findOneBy({ id });

    if (!foundForm) {
      throw new NotFoundException('Form was not found');
    }

    return foundForm;
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
    const foundForm = await fakeFormsService.findOne(id);

    return await fakeFormRepository.remove(foundForm);
  },
};
