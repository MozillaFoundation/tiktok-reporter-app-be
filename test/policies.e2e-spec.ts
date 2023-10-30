import * as request from 'supertest';

import { DEFAULT_GUID, defaultCreatePolicyDto } from '../src/utils/constants';

import { INestApplication } from '@nestjs/common';
import { PolicyType } from 'src/policies/entities/policy.entity';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Policies', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create policy request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/policies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(createResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(createResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(createResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(getResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(getResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(getResponseBody.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(getResponseBody.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('handles a findOne policy request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/policies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(getResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(getResponseBody.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(getResponseBody.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/policies/invalidformat')
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('findOne returns 404 Not Found when non existent id was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/policies/${DEFAULT_GUID}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(getResponseBody.message).toEqual('Policy was not found');
    expect(getResponseBody.error).toEqual('Not Found');
    expect(getResponseBody.statusCode).toEqual(404);
  });

  it('handles a findAll policies request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/policies')
      .send()
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(createResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(createResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(createResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(getResponseBody).toEqual(
      expect.arrayContaining([createResponseBody]),
    );
  });

  it('update returns the updated policy with all changes updated', async () => {
    const updatedType = PolicyType.PrivacyPolicy;
    const updatedTitle = 'UPDATE Test Policy Title';
    const updatedSubtitle = 'UPDATE Test Policy SubTitle';
    const updatedText = 'UPDATE Test Policy Text';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/policies/${createResponseBody.id}`)
      .send({
        type: updatedType,
        title: updatedTitle,
        subtitle: updatedSubtitle,
        text: updatedText,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(createResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(createResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(createResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(updateResponseBody.type).toEqual(updatedType);
    expect(updateResponseBody.title).toEqual(updatedTitle);
    expect(updateResponseBody.subtitle).toEqual(updatedSubtitle);
    expect(updateResponseBody.text).toEqual(updatedText);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update returns the updated policy with the partial changes updated', async () => {
    const updatedTitle = 'UPDATED Title';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/policies/${createResponseBody.id}`)
      .send({
        title: updatedTitle,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(createResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(createResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(createResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(updateResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(updateResponseBody.title).toEqual(updatedTitle);
    expect(updateResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(updateResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update returns 404 NotFound when no policy was found', async () => {
    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/policies/${DEFAULT_GUID}`)
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Policy was not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update returns 400 Bad Request invalid id format was provided', async () => {
    const policyTitle = 'Test Create Policy Title';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/policies/invalidformat')
      .send({ title: policyTitle })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('delete returns the deleted policy', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/policies')
      .send(defaultCreatePolicyDto)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/policies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(createResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(createResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(createResponseBody.text).toEqual(defaultCreatePolicyDto.text);

    expect(deleteResponseBody.type).toEqual(defaultCreatePolicyDto.type);
    expect(deleteResponseBody.title).toEqual(defaultCreatePolicyDto.title);
    expect(deleteResponseBody.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    expect(deleteResponseBody.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('delete returns 404 NotFound when no policy was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/policies/${DEFAULT_GUID}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Policy was not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/policies/invalidformat')
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });
});
