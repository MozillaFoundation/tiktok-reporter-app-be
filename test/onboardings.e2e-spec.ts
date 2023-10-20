import * as request from 'supertest';

import {
  DEFAULT_GUID,
  defaultCreateOnboardingDto,
} from '../src/utils/constants';

import { INestApplication } from '@nestjs/common';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Onboardings', () => {
  let app: INestApplication;
  let firstOnboardingStep: OnboardingStep;
  let secondOnboardingStep: OnboardingStep;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
    await createOnboardingSteps();
  });

  const createOnboardingSteps = async () => {
    const { body: firstOnboardingStepBody } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send({
        title: 'Test First Onboarding Step Title',
        description: 'Test First Onboarding Step Description',
        imageUrl: 'Test First Onboarding Step ImageURL',
        details: 'Test First Onboarding Step Details',
        order: 1,
      })
      .expect(201);

    firstOnboardingStep = firstOnboardingStepBody;
    const { body: secondOnboardingStepBody } = await request(
      app.getHttpServer(),
    )
      .post('/onboarding-steps')
      .send({
        title: 'Test Second Onboarding Step Title',
        description: 'Test Second Onboarding Step Description',
        imageUrl: 'Test Second Onboarding Step ImageURL',
        details: 'Test Second Onboarding Step Details',
        order: 1,
      })
      .expect(201);

    secondOnboardingStep = secondOnboardingStepBody;
  };

  it('handles a create onboarding request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/onboardings/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.id).toBeDefined();
    expect(createResponseBody.name).toEqual(defaultCreateOnboardingDto.name);
    expect(createResponseBody.steps.length).toEqual(1);

    expect(getResponseBody.id).toEqual(createResponseBody.id);
    expect(getResponseBody.name).toEqual(defaultCreateOnboardingDto.name);
    expect(getResponseBody.steps.length).toEqual(1);
  });

  it('handles a findOne onboarding request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/onboardings/${createResponseBody.id}`)
      .expect(200);

    expect(getResponseBody.id).toEqual(createResponseBody.id);
    expect(getResponseBody.name).toEqual(defaultCreateOnboardingDto.name);
    expect(getResponseBody.steps.length).toEqual(1);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/onboardings/invalidformat')
      .expect(400);

    expect(getResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(getResponseBody.error).toEqual('Bad Request');
    expect(getResponseBody.statusCode).toEqual(400);
  });

  it('handles a findAll onboardings request', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/onboardings')
      .expect(200);

    expect(getResponseBody.length).toEqual(2);
    expect(getResponseBody).toEqual(
      expect.arrayContaining([createResponseBody]),
    );
  });

  it('update returns the updated onboarding with all changes updated', async () => {
    const updatedName = 'UPDATE Test Onboarding Step Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboardings/${createResponseBody.id}`)
      .send({
        name: updatedName,
        stepIds: [secondOnboardingStep.id],
      })
      .expect(200);

    expect(createResponseBody.steps.length).toEqual(1);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);
    expect(updateResponseBody.name).toEqual(updatedName);
    expect(updateResponseBody.steps.length).toEqual(2);
  });

  it('update returns the updated onboarding with the partial changes updated', async () => {
    const updatedName = 'Test Onboarding Step Name';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboardings/${createResponseBody.id}`)
      .send({
        name: updatedName,
      })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(updateResponseBody.name).toEqual(updatedName);
    expect(updateResponseBody.steps.length).toEqual(1);
  });

  it('update returns 404 NotFound when no onboarding was found', async () => {
    const updatedName = 'Test Onboarding Step Name';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/onboardings/${DEFAULT_GUID}`)
      .send({ name: updatedName })
      .expect(404);

    expect(updateResponseBody.message).toEqual('Onboarding was not found');
    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update returns 400 Bad Request invalid id format was provided', async () => {
    const updatedName = 'Test Onboarding Step Name';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch('/onboardings/invalidformat')
      .send({ name: updatedName })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('delete returns the deleted onboarding', async () => {
    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Onboarding Step Name',
        stepIds: [firstOnboardingStep.id],
      })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/onboardings/${createResponseBody.id}`)
      .expect(200);

    expect(deleteResponseBody.name).toEqual(defaultCreateOnboardingDto.name);
  });

  it('delete returns 404 NotFound when no onboarding was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/onboardings/${DEFAULT_GUID}`)
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Onboarding was not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/onboardings/invalidformat')
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });
});
