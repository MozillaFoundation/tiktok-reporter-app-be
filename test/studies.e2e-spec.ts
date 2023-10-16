import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Study', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create study request', async () => {
    const studyName = 'Test Create First Study';
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({ name: studyName })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(getResponseBody.name).toEqual(studyName);
  });

  it('handles a findAll study request', async () => {
    const studyName = 'Test Create Second Study';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({ name: studyName })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies')
      .expect(200);
    console.log('getResponseBody', JSON.stringify(getResponseBody));

    expect(createResponseBody.name).toEqual(studyName);
    expect(getResponseBody.length).toEqual(1);
    expect(getResponseBody.at(0).name).toEqual(studyName);
  });

  it('update returns the updated study', async () => {
    const studyName = 'Test Create Second Study';
    const updatedStudyName = 'UPDATE Test Create Second Study';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({ name: studyName })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({ name: updatedStudyName })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(createResponseBody.id).toEqual(updateResponseBody.id);
  });

  it('update return 404 NotFound when no study was found', async () => {
    const studyName = 'Test Create Second Study';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/studies/12')
      .send({ name: studyName })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Study not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update returns the updated study', async () => {
    const studyName = 'Test Create Second Study';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({ name: studyName })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${createResponseBody.id}`)
      .send()
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(deleteResponseBody.name).toEqual(studyName);
  });

  it('delete return 404 NotFound when no study was found', async () => {
    const studyName = 'Test Create Second Study';

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/studies/12')
      .send({ name: studyName })
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Study not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });
});
