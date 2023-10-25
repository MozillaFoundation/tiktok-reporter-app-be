import { DEFAULT_GUID, defaultCreateFormDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { Form } from './entities/form.entity';
import { FormsService } from './forms.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TextField } from './types/fields/text.field';
import { TextFieldDto } from './dtos/text-field.dto';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FormsService', () => {
  let service: FormsService;
  let repository: Repository<Form>;
  const REPOSITORY_TOKEN = getRepositoryToken(Form);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<Form>() },
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    repository = module.get<Repository<Form>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created form', async () => {
    const createdEntity = await service.create(defaultCreateFormDto);

    const [firstDtoField] = defaultCreateFormDto.fields;

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateFormDto.name);
    expect(createdEntity.fields).toBeDefined();
    expect(createdEntity.fields.length).toEqual(3);

    const [firstCreatedField] = createdEntity.fields;

    expect(firstCreatedField.id).toBeDefined();
    expect(firstCreatedField.type).toEqual(firstDtoField.type);
    expect(firstCreatedField.label).toEqual(firstDtoField.label);
    expect(firstCreatedField.description).toEqual(firstDtoField.description);

    expect((firstCreatedField as TextField).placeholder).toEqual(
      (firstDtoField as TextFieldDto).placeholder,
    );
    expect((firstCreatedField as TextField).isRequired).toEqual(
      firstDtoField.isRequired,
    );
    expect((firstCreatedField as TextField).multiline).toEqual(
      (firstDtoField as TextFieldDto).multiline,
    );
    expect((firstCreatedField as TextField).maxLines).toEqual(
      (firstDtoField as TextFieldDto).maxLines,
    );
  });

  it('findAll returns the list of all forms including the newly created one', async () => {
    const createdEntity = await service.create(defaultCreateFormDto);

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findOne returns newly created form', async () => {
    const createdEntity = await service.create(defaultCreateFormDto);

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no policy was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove removes the form', async () => {
    const createdEntity = await service.create(defaultCreateFormDto);

    const removedEntity = await service.remove(createdEntity.id);

    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no form was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
