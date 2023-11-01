import * as request from 'supertest';

import { Policy, PolicyType } from 'src/policies/entities/policy.entity';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { DEFAULT_GUID } from '../src/utils/constants';
import { FieldType } from 'src/forms/types/fields/field.type';
import { Form } from 'src/forms/entities/form.entity';
import { INestApplication } from '@nestjs/common';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';

describe('Study', () => {
  let app: INestApplication;
  let firstCountryCode: CountryCode;
  let secondCountryCode: CountryCode;
  let firstPolicy: Policy;
  let secondPolicy: Policy;
  let firstOnboarding: Onboarding;
  let secondOnboarding: Onboarding;
  let firstStudyForm: Form;
  let secondStudyForm: Form;

  beforeEach(async () => {
    app = await RegretsReporterTestSetup.getInstance().getApp();
    await createCountryCode();
    await createPolicy();
    await createOnboarding();
    await createStudyForms();
  });

  const createCountryCode = async () => {
    const { body: firstCountryCodeBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({
        countryCode: 'Test Create First Country Code',
        countryName: 'Test Create First Country Code Name',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: secondCountryCodeBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({
        countryCode: 'Test Create Second Country Code',
        countryName: 'Test Create Second Country Code Name',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    firstCountryCode = firstCountryCodeBody;
    secondCountryCode = secondCountryCodeBody;
  };

  const createPolicy = async () => {
    const { body: firstPolicyBody } = await request(app.getHttpServer())
      .post('/policies')
      .send({
        type: PolicyType.TermsOfService,
        title: 'Test Create First Policy Title',
        subtitle: 'Test Create First Policy SubTitle',
        text: 'Test Create First Policy Text',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: secondPolicyBody } = await request(app.getHttpServer())
      .post('/policies')
      .send({
        type: PolicyType.PrivacyPolicy,
        title: 'Test Create Second Policy Title',
        subtitle: 'Test Create Second Policy SubTitle',
        text: 'Test Create First Second Text',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    firstPolicy = firstPolicyBody;
    secondPolicy = secondPolicyBody;
  };

  const createOnboarding = async () => {
    const { body: firstOnboardingStep } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send({
        title: 'Test First Onboarding Step Title',
        subtitle: 'Test First Onboarding Step SubTitle',
        description: 'Test First Onboarding Step Description',
        imageUrl: 'Test First Onboarding Step ImageURL',
        details: 'Test First Onboarding Step Details',
        order: 1,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: secondOnboardingStep } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send({
        title: 'Test Second Onboarding Step Title',
        subtitle: 'Test Second Onboarding Step SubTitle',
        description: 'Test Second Onboarding Step Description',
        imageUrl: 'Test Second Onboarding Step ImageURL',
        details: 'Test Second Onboarding Step Details',
        order: 2,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: firstOnboardingFormBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        name: 'Name of first onboarding form',
        fields: [
          {
            type: FieldType.TextField,
            label: 'First Text Field Label',
            description: 'First Text Field description',
            placeholder: 'First Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: firstOnboardingBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test First Onboarding Name',
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingFormBody.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: secondOnboardingBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Second Onboarding Name',
        stepIds: [secondOnboardingStep.id],
        formId: firstOnboardingFormBody.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    firstOnboarding = firstOnboardingBody;
    secondOnboarding = secondOnboardingBody;
  };

  const createStudyForms = async () => {
    const { body: firstStudyFormBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        name: 'Name of first onboarding form',
        fields: [
          {
            type: FieldType.TextField,
            label: 'First Text Field Label',
            description: 'First Text Field description',
            placeholder: 'First Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);
    firstStudyForm = firstStudyFormBody;

    const { body: secondStudyFormBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        name: 'Name of first onboarding form',
        fields: [
          {
            type: FieldType.TextField,
            label: 'Second Text Field Label',
            description: 'Second Text Field description',
            placeholder: 'Second Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);
    secondStudyForm = secondStudyFormBody;
  };

  it('handles a create study request', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.supportsRecording).toEqual(true);
    expect(getResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(getResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(getResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('create study request returns the new study no duplicate country codes', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [
          firstCountryCode.id,
          firstCountryCode.id,
          firstCountryCode.id,
          firstCountryCode.id,
        ],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(createResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.supportsRecording).toEqual(true);
    expect(getResponseBody.countryCodes.length).toEqual(1);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(getResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('create study request returns the new study no duplicate policies', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [
          firstPolicy.id,
          firstPolicy.id,
          firstPolicy.id,
          firstPolicy.id,
          firstPolicy.id,
        ],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.supportsRecording).toEqual(true);
    expect(getResponseBody.countryCodes.length).toEqual(1);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.length).toEqual(1);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(getResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('create study return 400 when invalid id format is provided to countryCodeIds', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: ['Invalid id format'],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 400 when non existent id is provided to countryCodeIds', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 400 when invalid id format is provided to policyIds', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: ['Invalid id format'],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 400 when non existent id is provided to policyIds', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 400 when invalid id format is provided to onboardingId', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: 'Invalid Id Format',
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 404 when non existent id is provided to onboardingId', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(createResponseBody.error).toEqual('Not Found');
    expect(createResponseBody.statusCode).toEqual(404);
  });

  it('create study return 400 when invalid id format is provided to formId', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: 'Invalid Id Format',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('create study return 404 when non existent id is provided to formId', async () => {
    const studyName = 'Test Create First Study';
    const studyDescription = 'Test Create First Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: DEFAULT_GUID,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(createResponseBody.error).toEqual('Not Found');
    expect(createResponseBody.statusCode).toEqual(404);
  });

  it('handles a findByIpAddress study request returns all studies when ip address is reserved', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createdResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/by-country-code`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const foundCreatedStudy = getResponseBody.find(
      (study) => study.id === createdResponseBody.id,
    );

    expect(foundCreatedStudy.name).toEqual(studyName);
    expect(foundCreatedStudy.description).toEqual(studyDescription);
    expect(foundCreatedStudy.isActive).toEqual(true);
    expect(foundCreatedStudy.supportsRecording).toEqual(true);
    expect(foundCreatedStudy.countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(foundCreatedStudy.policies.at(0).id).toEqual(firstPolicy.id);
    expect(foundCreatedStudy.onboarding.id).toEqual(firstOnboarding.id);
    expect(foundCreatedStudy.form.id).toEqual(firstStudyForm.id);
  });

  it('handles a findOne study request', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.supportsRecording).toEqual(true);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(getResponseBody.onboarding.form.id).toEqual(firstOnboarding.form.id);
    expect(getResponseBody.onboarding.steps.at(0).id).toEqual(
      firstOnboarding.steps.at(0).id,
    );
    expect(getResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('findOne returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies/invalidformat')
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
      .get(`/studies/${DEFAULT_GUID}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(getResponseBody.message).toEqual('Study not found');
    expect(getResponseBody.error).toEqual('Not Found');
    expect(getResponseBody.statusCode).toEqual(404);
  });

  it('handles a findAll study request', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies')
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const studyNames = getResponseBody.map((study) => study.name);
    expect(studyNames).toContain(createResponseBody.name);
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
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
    expect(updateResponseBody.supportsRecording).toEqual(false);
    expect(updateResponseBody.countryCodes.length).toEqual(2);
    expect(updateResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(updateResponseBody.policies.length).toEqual(2);
    expect(updateResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
      secondPolicy.id,
    ]);
    expect(updateResponseBody.onboarding.id).toEqual(secondOnboarding.id);
    expect(updateResponseBody.form.id).toEqual(secondStudyForm.id);
  });

  it('update returns the updated study with all new and old values', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        countryCodeIds: [secondCountryCode.id],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.id).toEqual(getResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(getResponseBody.name).toEqual(updatedStudyName);
    expect(getResponseBody.description).toEqual(updateStudyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.supportsRecording).toEqual(true);
    expect(getResponseBody.countryCodes.length).toEqual(2);
    expect(getResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(getResponseBody.policies.length).toEqual(1);
    expect(getResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(getResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('update returns the updated study with all changes updated and no duplicate country codes', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [
          secondCountryCode.id,
          secondCountryCode.id,
          secondCountryCode.id,
        ],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
    expect(updateResponseBody.supportsRecording).toEqual(false);
    expect(updateResponseBody.countryCodes.length).toEqual(2);
    expect(updateResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(updateResponseBody.policies.length).toEqual(2);
    expect(updateResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
      secondPolicy.id,
    ]);
    expect(updateResponseBody.onboarding.id).toEqual(secondOnboarding.id);
    expect(updateResponseBody.form.id).toEqual(secondStudyForm.id);
  });

  it('update returns the updated study with all changes updated and no duplicate policies', async () => {
    const studyName = 'Test Create Third Study';
    const studyDescription = 'Test Create Third Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id, secondPolicy.id, secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
    expect(updateResponseBody.supportsRecording).toEqual(false);
    expect(updateResponseBody.countryCodes.length).toEqual(2);
    expect(updateResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(updateResponseBody.policies.length).toEqual(2);
    expect(updateResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
      secondPolicy.id,
    ]);
    expect(updateResponseBody.onboarding.id).toEqual(secondOnboarding.id);
    expect(updateResponseBody.form.id).toEqual(secondStudyForm.id);
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
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({ name: updatedStudyName })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.supportsRecording).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(createResponseBody.form.id).toEqual(firstStudyForm.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(studyDescription);
    expect(updateResponseBody.isActive).toEqual(true);
    expect(updateResponseBody.supportsRecording).toEqual(true);
    expect(updateResponseBody.countryCodes.length).toEqual(1);
    expect(updateResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(updateResponseBody.policies.length).toEqual(1);
    expect(updateResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(updateResponseBody.onboarding.id).toEqual(firstOnboarding.id);
    expect(updateResponseBody.form.id).toEqual(firstStudyForm.id);
  });

  it('update return 404 NotFound when no study was found', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${DEFAULT_GUID}`)
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
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
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('update return 400 Bad Request invalid id format was provided to countryCodeIds', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        countryCodeIds: ['Invalid id format'],
        policyIds: [firstPolicy.id],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('update return 400 Bad Request invalid id format was provided to policyIds', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: ['Invalid id format'],
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('update return 400 Bad Request invalid id format was provided to onboardingId', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: 'Invalid Id Format',
        formId: secondStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('update return 404 Not Found when non existent id was provided to onboardingId', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: secondStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(updateResponseBody.error).toEqual('Not Found');
    expect(updateResponseBody.statusCode).toEqual(404);
  });

  it('update return 400 Bad Request invalid id format was provided to formId', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: 'Invalid Id Format',
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(updateResponseBody.error).toEqual('Bad Request');
    expect(updateResponseBody.statusCode).toEqual(400);
  });

  it('update return 404 Not Found when non existent id was provided to formId', async () => {
    const studyName = 'Test Create Fourth Study';
    const studyDescription = 'Test Create Fourth Study DESCRIPTION';

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: DEFAULT_GUID,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

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
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${createResponseBody.id}`)
      .send()
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(deleteResponseBody.name).toEqual(studyName);
  });

  it('delete returns 404 NotFound when no study was found', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete(`/studies/${DEFAULT_GUID}`)
      .send()
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(404);

    expect(deleteResponseBody.message).toEqual('Study not found');
    expect(deleteResponseBody.error).toEqual('Not Found');
    expect(deleteResponseBody.statusCode).toEqual(404);
  });

  it('delete returns 400 Bad Request when invalid id format was provided', async () => {
    const { body: deleteResponseBody } = await request(app.getHttpServer())
      .delete('/studies/invalidformat')
      .send()
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(400);

    expect(deleteResponseBody.message).toEqual(
      'Validation failed (uuid is expected)',
    );
    expect(deleteResponseBody.error).toEqual('Bad Request');
    expect(deleteResponseBody.statusCode).toEqual(400);
  });

  it('get returns the study with no country code when deleting the country code associated to the study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    expect(createResponseBody.countryCodes).not.toBeNull();
    expect(createResponseBody.countryCodes.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .delete(`/country-codes/${firstCountryCode.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.countryCodes.length).toEqual(0);
  });

  it('get returns the study with no policy when deleting the policy associated to the study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    expect(createResponseBody.policies).not.toBeNull();
    expect(createResponseBody.policies.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .delete(`/policies/${firstPolicy.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.policies.length).toEqual(0);
  });

  it('get returns the study with no form when deleting the form associated to the study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    expect(createResponseBody.form).not.toBeNull();

    await request(app.getHttpServer())
      .delete(`/forms/${firstStudyForm.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.form).toBeNull();
  });

  it('get returns the study with no onboarding when deleting the onboarding associated to the study', async () => {
    const studyName = 'Test Create Fifth Study';
    const studyDescription = 'Test Create Fifth Study DESCRIPTION';

    const { body: createResponseBody } = await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        supportsRecording: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(201);

    expect(createResponseBody.onboarding).not.toBeNull();

    await request(app.getHttpServer())
      .delete(`/onboardings/${firstOnboarding.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .set({ 'X-API-KEY': process.env.API_KEY })
      .expect(200);

    expect(getResponseBody.onboarding).toBeNull();
  });
});
