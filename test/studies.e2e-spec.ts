import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Study', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a create study request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({ name: 'Test Create Study' })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);
    console.log('getResponseBody', getResponseBody);
    expect(createResponseBody.name).toEqual('Test Create Study');
    expect(getResponseBody.name).toEqual('Test Create Study');
  });
});
