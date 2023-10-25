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
import { isFilledArray } from 'src/utils/isFilledArray';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import { mapFormEntityToDto, mapFormsToDtos } from './mappers/mapEntitiesToDto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}
  async create(headerApiKey: string, createFormDto: CreateFormDto) {
    const mappedFields = mapFormFields(createFormDto.fields);

    if (!isFilledArray(mappedFields)) {
      throw new BadRequestException(
        'The form must include at least one field.',
      );
    }

    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdForm = this.formRepository.create({
      name: createFormDto.name,
      fields: mappedFields,
      createdBy: savedApiKey,
    });

    const savedForm = await this.formRepository.save(createdForm);

    return mapFormEntityToDto(savedForm);
  }

  async findAll() {
    const allForms = await this.formRepository.find();

    return mapFormsToDtos(allForms);
  }

  async findOne(id: string) {
    const form = await this.formRepository.findOneBy({ id });

    if (!form) {
      throw new NotFoundException('Form was not found');
    }

    return mapFormEntityToDto(form);
  }

  async remove(id: string) {
    const form = await this.formRepository.findOneBy({ id });

    if (!form) {
      throw new NotFoundException('Form was not found');
    }

    const removedForm = await this.formRepository.remove(form);
    return mapFormEntityToDto(removedForm);
  }
}
