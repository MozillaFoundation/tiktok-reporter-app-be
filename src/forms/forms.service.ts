import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dtos/create-form.dto';

import { mapFormFields } from './mappers/form-fields.mapper';
import { isEmpty } from 'class-validator';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {}
  async create(createFormDto: CreateFormDto) {
    const mappedFields = mapFormFields(createFormDto.fields);

    if (isEmpty(mappedFields)) {
      throw new BadRequestException(
        'The form must include at least one field.',
      );
    }

    const createdForm = this.formRepository.create({
      name: createFormDto.name,
      fields: mappedFields,
    });

    return await this.formRepository.save(createdForm);
  }

  async findAll() {
    return await this.formRepository.find();
  }

  async findOne(id: string) {
    const form = await this.formRepository.findOneBy({ id });

    if (!form) {
      throw new NotFoundException('Form was not found');
    }

    return form;
  }

  async remove(id: string) {
    const form = await this.findOne(id);

    return await this.formRepository.remove(form);
  }
}
