import {
  API_KEY_HEADER_VALUE,
  DEFAULT_GUID,
  defaultCreateFormDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { NotFoundException } from '@nestjs/common';
import { TextField } from './types/fields/text.field';
import { TextFieldDto } from './dtos/text-field.dto';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('FormsController', () => {
  let controller: FormsController;
  let configService: ConfigService;
  let apiKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      controllers: [FormsController],
      providers: [{ provide: FormsService, useValue: fakeFormsService }],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    configService = module.get<ConfigService>(ConfigService);
    const formsService = module.get<FormsService>(FormsService);
    await formsService?.['initApiKey']();

    apiKey = configService.get<string>('API_KEY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created form', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      defaultCreateFormDto,
    );
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
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      defaultCreateFormDto,
    );

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created form', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      defaultCreateFormDto,
    );

    const foundEntity = await controller.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no form was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove removes the form', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      defaultCreateFormDto,
    );

    const removedEntity = await controller.remove(createdEntity.id);
    await expect(controller.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no form was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
