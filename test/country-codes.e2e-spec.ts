import * as request from 'supertest';

import { DEFAULT_GUID } from './constants';
import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Country Code', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create country code request', async () => {
    const countryCode = 'Test Create First Country Code';
    const countryName = 'Test Create First Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/country-codes/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(createResponseBody.countryName).toEqual(countryName);

    expect(getResponseBody.code).toEqual(countryCode);
    expect(getResponseBody.countryName).toEqual(countryName);
  });

  it('handles a findOne country codes request', async () => {
    const countryCode = 'Test Create Second Country Code';
    const countryName = 'Test Create Second Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/country-codes/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(createResponseBody.countryName).toEqual(countryName);

    expect(getResponseBody.code).toEqual(countryCode);
    expect(getResponseBody.countryName).toEqual(countryName);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/country-codes/invalidformat')
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('handles a findAll country codes request', async () => {
    const countryCode = 'Test Create Second Country Code';
    const countryName = 'Test Create Second Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/country-codes')
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(createResponseBody.countryName).toEqual(countryName);

    expect(getResponseBody.length).toEqual(118);
    const foundCountryCode = getResponseBody.find(
      (cc) => cc.code === countryCode,
    );

    expect(foundCountryCode).toBeDefined();
  });

  it('update returns the updated country code', async () => {
    const countryCode = 'Test Create Second Country Code';
    const countryName = 'Test Create Second Country Code Name';

    const updatedCountryCode = 'UPDATE Test Create Second Country Code';
    const updatedCountryName = 'UPDATE Test Create Second Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/country-codes/${createResponseBody.id}`)
      .send({
        countryCode: updatedCountryCode,
        countryName: updatedCountryName,
      })
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(createResponseBody.countryName).toEqual(countryName);

    expect(updateResponseBody.code).toEqual(updatedCountryCode);
    expect(updateResponseBody.countryName).toEqual(updatedCountryName);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update returns 404 NotFound when no country code was found', async () => {
    const countryCode = 'Test Create Second country code';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/country-codes/${DEFAULT_GUID}`)
      .send({ countryCode })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Country Code not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update returns 400 Bad Request invalid id format was provided', async () => {
    const countryCode = 'Test Create Second country code';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/country-codes/invalidformat')
      .send({ countryCode })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('delete returns the deleted country code', async () => {
    const countryCode = 'Test Create Second Country Code';
    const countryName = 'Test Create Second Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/country-codes/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(createResponseBody.countryName).toEqual(countryName);

    expect(deleteResponseBody.code).toEqual(countryCode);
    expect(deleteResponseBody.countryName).toEqual(countryName);
  });

  it('delete returns 404 NotFound when no country code was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/country-codes/${DEFAULT_GUID}`)
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Country Code not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/country-codes/invalidformat')
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });
});
