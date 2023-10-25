import * as request from 'supertest';

import { DEFAULT_GUID, defaultCreateFormDto } from '../src/utils/constants';

import { FieldType } from 'src/forms/types/fields/field.type';
import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Forms', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create form request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send(defaultCreateFormDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/forms/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.id).toBeDefined();
    expect(createResponseBody.name).toEqual(defaultCreateFormDto.name);
    expect(createResponseBody.fields).toBeDefined();
    expect(createResponseBody.fields.length).toEqual(3);

    expect(getResponseBody.id).toBeDefined();
    expect(getResponseBody.name).toEqual(defaultCreateFormDto.name);
    expect(getResponseBody.fields).toBeDefined();
    expect(getResponseBody.fields.length).toEqual(3);
  });

  it('create form return 400 Bad Request when the form name property is empty', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({ ...defaultCreateFormDto, name: '' })
      .expect(400);

    expect(createResponseBody.message).toEqual(['name should not be empty']);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create form return 400 Bad Request when the fields property is empty', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({ ...defaultCreateFormDto, fields: [] })
      .expect(400);

    expect(createResponseBody.message).toEqual([
      'The fields property cannot be empty',
    ]);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create form return 400 Bad Request when the field has invalid type', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        ...defaultCreateFormDto,
        fields: [
          {
            type: 'Invalid Field type',
            label: 'Text Field Label',
            description: 'Text Field description',
            placeholder: 'Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
      .expect(400);

    expect(createResponseBody.message).toEqual([
      'One of the fields does not have the correct type',
    ]);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create form return 400 Bad Request when the text field has invalid properties', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        ...defaultCreateFormDto,
        fields: [
          {
            type: FieldType.TextField,
            // label, description and placeholder are invalid strings
            label: true,
            description: true,
            placeholder: true,
            isRequired: 'Invalid Boolean',
            multiline: 'Invalid Boolean',
            maxLines: 'Invalid Number',
          },
        ],
      })
      .expect(400);

    expect(createResponseBody.message).toEqual([
      'Is Required must be a valid boolean;Label must be a valid string;Description must be a valid string;PlaceHolder must be a valid string;Multiline must be a valid boolean;MaxLines must be a valid number',
    ]);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create form return 400 Bad Request when the dropdown field has invalid properties', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        ...defaultCreateFormDto,
        fields: [
          {
            type: FieldType.DropDown,
            // label, description, selected and placeholder are invalid strings
            label: true,
            description: true,
            placeholder: true,
            isRequired: 'Invalid Boolean',
            options: {},
            selected: true,
            hasOtherOption: 'Invalid Boolean',
          },
        ],
      })
      .expect(400);

    expect(createResponseBody.message).toEqual([
      'Is Required must be a valid boolean;Label must be a valid string;Description must be a valid string;PlaceHolder must be a valid string;Options cannot be empty;Selected must be a valid string value;Has Other Option must be a valid boolean value',
    ]);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create form return 400 Bad Request when the slider field has invalid properties', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        ...defaultCreateFormDto,
        fields: [
          {
            type: FieldType.Slider,
            // label, description, leftLabel, rightLabel selected and placeholder are invalid strings
            label: true,
            description: true,
            isRequired: 'Invalid Boolean',
            max: 'Invalid Number',
            leftLabel: true,
            rightLabel: true,
            step: 'Invalid Number',
          },
        ],
      })
      .expect(400);

    expect(createResponseBody.message).toEqual([
      'Is Required must be a valid boolean;Label must be a valid string;Description must be a valid string;Max must be a valid number;Left Label must be a valid string;Right Label must be a valid string;Step must be a valid number',
    ]);
    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('handles a findOne form request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send(defaultCreateFormDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/forms/${createResponseBody.id}`)
      .expect(200);

    expect(getResponseBody.id).toBeDefined();
    expect(getResponseBody.name).toEqual(defaultCreateFormDto.name);
    expect(getResponseBody.fields).toBeDefined();
    expect(getResponseBody.fields.length).toEqual(3);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/forms/invalidformat')
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('findOne returns 404 Not Found when non existent id was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/forms/${DEFAULT_GUID}`)
      .expect(404);

    expect(getResponseBody.message).toEqual('Form was not found');
    expect(getResponseBody.error).toEqual('Not Found');
    expect(getResponseBody.statusCode).toEqual(404);
  });

  it('handles a findAll forms request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send(defaultCreateFormDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/forms')
      .expect(200);

    expect(getResponseBody).toEqual(
      expect.arrayContaining([createResponseBody]),
    );
  });

  it('delete returns the deleted form', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/forms')
      .send(defaultCreateFormDto)
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/forms/${createResponseBody.id}`)
      .expect(200);

    expect(deleteResponseBody.name).toEqual(defaultCreateFormDto.name);
    expect(deleteResponseBody.fields).toBeDefined();
    expect(deleteResponseBody.fields.length).toEqual(3);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/forms/invalidformat')
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });

  it('delete returns 404 NotFound when no form was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/forms/${DEFAULT_GUID}`)
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Form was not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });
});
