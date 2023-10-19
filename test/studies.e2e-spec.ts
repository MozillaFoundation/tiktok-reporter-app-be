import * as request from 'supertest';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { DEFAULT_GUID } from '../src/utils/constants';
import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Study', () => {
  let app: INestApplication;
  let newCountryCode: CountryCode;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
    const countryCode = 'Test Create First Country Code';
    const countryName = 'Test Create First Country Code Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({ countryCode, countryName })
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
        countryCodeIds: [newCountryCode.id],
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

  it('handles a findByCountryCode study request returns study by country code id', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/country-codes/${newCountryCode.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(newCountryCode.id);

    expect(getResponseBody.at(0).name).toEqual(studyName);
    expect(getResponseBody.at(0).description).toEqual(studyDescription);
    expect(getResponseBody.at(0).countryCodes.at(0).id).toEqual(
      newCountryCode.id,
    );
  });

  it('handles a findByCountryCode study request returns study by country code value', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/country-codes/${newCountryCode.code}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(newCountryCode.id);

    expect(getResponseBody.at(0).name).toEqual(studyName);
    expect(getResponseBody.at(0).description).toEqual(studyDescription);
    expect(getResponseBody.at(0).countryCodes.at(0).id).toEqual(
      newCountryCode.id,
    );
  });

  it('handles a findOne study request', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
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
    expect(getResponseBody.countryCodes.at(0).id).toEqual(newCountryCode.id);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies/invalidformat')
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('handles a findAll study request', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
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

  it('update returns the updated study with all changes updated', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
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

  it('update returns the updated study with the partial changes updated', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({ name: updatedStudyName })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(studyDescription);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update return 404 NotFound when no study was found', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${DEFAULT_GUID}`)
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Study not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update return 400 Bad Request invalid id format was provided', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/studies/invalidformat')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('delete returns the deleted study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        countryCodeIds: [newCountryCode.id],
      })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${createResponseBody.id}`)
      .send()
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(deleteResponseBody.name).toEqual(studyName);
  });

  it('delete returns 404 NotFound when no study was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${DEFAULT_GUID}`)
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Study not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/studies/invalidformat')
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });
});
