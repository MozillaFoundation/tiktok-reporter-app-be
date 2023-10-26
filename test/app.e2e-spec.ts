import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('default call returns 200', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('returns 200 for load balancer heartbeat', () => {
    return request(app.getHttpServer()).get('/__lbheartbeat__').expect(200);
  });

  it('returns 200 for version', () => {
    return request(app.getHttpServer()).get('/__version__').expect(200);
  });

  it('returns 200 for heartbeat', () => {
    return request(app.getHttpServer()).get('/__heartbeat__').expect(200);
  });
});
