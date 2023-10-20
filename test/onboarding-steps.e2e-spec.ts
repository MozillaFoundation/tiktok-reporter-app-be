import * as request from 'supertest';

import {
  DEFAULT_GUID,
  defaultCreateOnboardingStepDto,
} from '../src/utils/constants';

import { INestApplication } from '@nestjs/common';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Onboarding Steps', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
  });

  it('handles a create onboarding step request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/onboarding-steps/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.id).toBeDefined();
    expect(createResponseBody.title).toEqual(
      defaultCreateOnboardingStepDto.title,
    );
    expect(createResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(createResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(createResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(createResponseBody.order).toEqual(
      defaultCreateOnboardingStepDto.order,
    );

    expect(getResponseBody.id).toBeDefined();
    expect(getResponseBody.title).toEqual(defaultCreateOnboardingStepDto.title);
    expect(getResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(getResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(getResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(getResponseBody.order).toEqual(defaultCreateOnboardingStepDto.order);
  });

  it('handles a findOne onboarding step request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/onboarding-steps/${createResponseBody.id}`)
      .expect(200);

    expect(getResponseBody.id).toEqual(createResponseBody.id);
    expect(getResponseBody.title).toEqual(defaultCreateOnboardingStepDto.title);
    expect(getResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(getResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(getResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(getResponseBody.order).toEqual(defaultCreateOnboardingStepDto.order);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/onboarding-steps/invalidformat')
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('handles a findAll onboarding steps request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/onboarding-steps')
      .expect(200);

    expect(getResponseBody).toEqual(
      expect.arrayContaining([createResponseBody]),
    );
  });

  it('update returns the updated onboarding Step with all changes updated', async () => {
    const updatedTitle = 'UPDATE Test Onboarding Step Title';
    const updatedDescription = 'UPDATE Test Onboarding Step Description';
    const updatedImageUrl = 'UPDATE Test Onboarding Step ImageURL';
    const updatedDetails = 'UPDATE Test Onboarding Step Details';
    const updatedOrder = 2;

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboarding-steps/${createResponseBody.id}`)
      .send({
        title: updatedTitle,
        description: updatedDescription,
        imageUrl: updatedImageUrl,
        details: updatedDetails,
        order: updatedOrder,
      })
      .expect(200);

    expect(createResponseBody.id).toBeDefined();
    expect(createResponseBody.title).toEqual(
      defaultCreateOnboardingStepDto.title,
    );
    expect(createResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(createResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(createResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(createResponseBody.order).toEqual(
      defaultCreateOnboardingStepDto.order,
    );

    expect(updateResponseBody.id).toEqual(createResponseBody.id);
    expect(updateResponseBody.title).toEqual(updatedTitle);
    expect(updateResponseBody.description).toEqual(updatedDescription);
    expect(updateResponseBody.imageUrl).toEqual(updatedImageUrl);
    expect(updateResponseBody.details).toEqual(updatedDetails);
    expect(updateResponseBody.order).toEqual(updatedOrder);
  });

  it('update returns the updated onboarding step with the partial changes updated', async () => {
    const updatedTitle = 'UPDATED Title';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboarding-steps/${createResponseBody.id}`)
      .send({
        title: updatedTitle,
      })
      .expect(200);

    expect(updateResponseBody.id).toEqual(createResponseBody.id);

    expect(updateResponseBody.title).toEqual(updatedTitle);
    expect(updateResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(updateResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(updateResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(updateResponseBody.order).toEqual(
      defaultCreateOnboardingStepDto.order,
    );
  });

  it('update returns 404 NotFound when no onboarding was found', async () => {
    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboarding-steps/${DEFAULT_GUID}`)
      .send(defaultCreateOnboardingStepDto)
      .expect(404);

    expect(updateResponseBody.message).toEqual('Onboarding step was not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update returns 400 Bad Request invalid id format was provided', async () => {
    const onboardingStepTitle = 'Test Create Onboarding Step Title';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/onboarding-steps/invalidformat')
      .send({ title: onboardingStepTitle })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('delete returns the deleted onboarding step', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send(defaultCreateOnboardingStepDto)
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/onboarding-steps/${createResponseBody.id}`)
      .expect(200);

    expect(deleteResponseBody.title).toEqual(
      defaultCreateOnboardingStepDto.title,
    );
    expect(deleteResponseBody.description).toEqual(
      defaultCreateOnboardingStepDto.description,
    );
    expect(deleteResponseBody.imageUrl).toEqual(
      defaultCreateOnboardingStepDto.imageUrl,
    );
    expect(deleteResponseBody.details).toEqual(
      defaultCreateOnboardingStepDto.details,
    );
    expect(deleteResponseBody.order).toEqual(
      defaultCreateOnboardingStepDto.order,
    );
  });

  it('delete returns 404 NotFound when no onboarding was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/onboarding-steps/${DEFAULT_GUID}`)
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Onboarding step was not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/onboarding-steps/invalidformat')
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });
});
