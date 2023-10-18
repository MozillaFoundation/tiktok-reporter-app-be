import * as request from 'supertest';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Study', () => {
  let app: INestApplication;
  let newCountryCode: CountryCode;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
    const countryCode = 'Test Create First Country Code';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode })
      .expect(201);

    newCountryCode = createResponseBody;
  });

  it('handles a create study request', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeId: newCountryCode.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(newCountryCode.id);
    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
  });

  it('handles a findAll study request', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeId: newCountryCode.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies')
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(newCountryCode.id);
    expect(getResponseBody.length).toEqual(1);
    expect(getResponseBody.at(0).name).toEqual(studyName);
  });

  it('update returns the updated study', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeId: newCountryCode.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({ name: updatedStudyName, description: updateStudyDescription })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update return 404 NotFound when no study was found', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/studies/00000000-0000-0000-0000-000000000000')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeId: newCountryCode.id,
      })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Study not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('delete returns the deleted study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeId: newCountryCode.id,
      })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${createResponseBody.id}`)
      .send()
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(deleteResponseBody.name).toEqual(studyName);
  });

  it('delete return 404 NotFound when no study was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/studies/00000000-0000-0000-0000-000000000000')
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Study not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });
});
