import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Country Code', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create country code request', async () => {
    const countryCode = 'Test Create First Country Code';
    const { body: createResponseBody, error } = await request(
      app.getHttpServer(),
    )
      .post('/country-codes')
      .send({ countryCode })
      .expect(201);

    console.log('error', JSON.stringify(error));
    console.log('createResponseBody', JSON.stringify(createResponseBody));

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/country-codes/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(getResponseBody.code).toEqual(countryCode);
  });

  it('handles a findAll country codes request', async () => {
    const countryCode = 'Test Create Second Country Code';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/country-codes')
      .expect(200);
    console.log('getResponseBody', JSON.stringify(getResponseBody));

    expect(createResponseBody.code).toEqual(countryCode);
    expect(getResponseBody.length).toEqual(1);
    expect(getResponseBody.at(0).code).toEqual(countryCode);
  });

  it('update returns the updated country code', async () => {
    const countryCode = 'Test Create Second Country Code';
    const updatedCountryCode = 'UPDATE Test Create Second Country Code';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/country-codes/${createResponseBody.id}`)
      .send({ countryCode: updatedCountryCode })
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(updateResponseBody.code).toEqual(updatedCountryCode);
    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update return 404 NotFound when no country code was found', async () => {
    const countryCode = 'Test Create Second country code';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/country-codes/00000000-0000-0000-0000-000000000000')
      .send({ countryCode })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Country Code not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('delete returns the deleted country code', async () => {
    const countryCode = 'Test Create Second country code';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/country-codes/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.code).toEqual(countryCode);
    expect(deleteResponseBody.code).toEqual(countryCode);
  });

  it('delete return 404 NotFound when no country code was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/country-codes/00000000-0000-0000-0000-000000000000')
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Country Code not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });
});
