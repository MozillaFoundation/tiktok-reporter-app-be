import * as request from 'supertest';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { DEFAULT_GUID } from '../src/utils/constants';
import { INestApplication } from '@nestjs/common';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { Policy } from 'src/policies/entities/policy.entity';
import { PolicyType } from 'src/types/policy.type';
import { RegretsReporterTestSetup } from './regretsReporterTestSetup';
import { Form } from 'src/forms/entities/form.entity';
import { FieldType } from 'src/forms/types/fields/field.type';

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
      .expect(201);

    const { body: secondCountryCodeBody } = await request(app.getHttpServer())
      .post('/country-codes')
      .send({
        countryCode: 'Test Create Second Country Code',
        countryName: 'Test Create Second Country Code Name',
      })
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
      .expect(201);
    const { body: secondPolicyBody } = await request(app.getHttpServer())
      .post('/policies')
      .send({
        type: PolicyType.PrivacyPolicy,
        title: 'Test Create Second Policy Title',
        subtitle: 'Test Create Second Policy SubTitle',
        text: 'Test Create First Second Text',
      })
      .expect(201);

    firstPolicy = firstPolicyBody;
    secondPolicy = secondPolicyBody;
  };

  const createOnboarding = async () => {
    const { body: firstOnboardingStep } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send({
        title: 'Test First Onboarding Step Title',
        description: 'Test First Onboarding Step Description',
        imageUrl: 'Test First Onboarding Step ImageURL',
        details: 'Test First Onboarding Step Details',
        order: 1,
      })
      .expect(201);

    const { body: secondOnboardingStep } = await request(app.getHttpServer())
      .post('/onboarding-steps')
      .send({
        title: 'Test Second Onboarding Step Title',
        description: 'Test Second Onboarding Step Description',
        imageUrl: 'Test Second Onboarding Step ImageURL',
        details: 'Test Second Onboarding Step Details',
        order: 2,
      })
      .expect(201);

    const { body: firstOnboardingFormBody } = await request(app.getHttpServer())
      .post('/forms')
      .send({
        name: 'Name of first onboarding form',
        fields: [
          {
            type: FieldType.TextField,
            label: 'First Text Field Label',
            placeholder: 'First Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
      .expect(201);

    const { body: firstOnboardingBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test First Onboarding Name',
        stepIds: [firstOnboardingStep.id],
        formId: firstOnboardingFormBody.id,
      })
      .expect(201);

    const { body: secondOnboardingBody } = await request(app.getHttpServer())
      .post('/onboardings')
      .send({
        name: 'Test Second Onboarding Name',
        stepIds: [secondOnboardingStep.id],
        formId: firstOnboardingFormBody.id,
      })
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
            placeholder: 'First Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
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
            placeholder: 'Second Text Field Placeholder',
            isRequired: true,
            multiline: true,
            maxLines: 2,
          },
        ],
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(getResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
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
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(createResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.countryCodes.length).toEqual(1);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
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
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.countryCodes.length).toEqual(1);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.length).toEqual(1);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
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
        countryCodeIds: ['Invalid id format'],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: ['Invalid id format'],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: 'Invalid Id Format',
        formId: firstStudyForm.id,
      })
      .expect(400);

    expect(createResponseBody.error).toEqual('Bad Request');
    expect(createResponseBody.statusCode).toEqual(400);
  });

  it('handles a findByCountryCode study request returns study by country code id', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/country-codes/${firstCountryCode.id}`)
      .expect(200);

    expect(getResponseBody.at(0).name).toEqual(studyName);
    expect(getResponseBody.at(0).description).toEqual(studyDescription);
    expect(getResponseBody.at(0).isActive).toEqual(true);
    expect(getResponseBody.at(0).isActive).toEqual(true);
    expect(getResponseBody.at(0).countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(getResponseBody.at(0).policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.at(0).onboarding.id).toEqual(firstOnboarding.id);
  });

  it('handles a findByCountryCode study request returns study by country code value', async () => {
    const studyName = 'Test Create Second Study';
    const studyDescription = 'Test Create Second Study DESCRIPTION';

    await request(app.getHttpServer())
      .post('/studies')
      .send({
        name: studyName,
        description: studyDescription,
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/country-codes/${firstCountryCode.code}`)
      .expect(200);

    expect(getResponseBody.at(0).name).toEqual(studyName);
    expect(getResponseBody.at(0).description).toEqual(studyDescription);
    expect(getResponseBody.at(0).isActive).toEqual(true);
    expect(getResponseBody.at(0).countryCodes.at(0).id).toEqual(
      firstCountryCode.id,
    );
    expect(getResponseBody.at(0).policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.at(0).onboarding.id).toEqual(firstOnboarding.id);
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get(`/studies/${createResponseBody.id}`)
      .expect(200);

    expect(getResponseBody.name).toEqual(studyName);
    expect(getResponseBody.description).toEqual(studyDescription);
    expect(getResponseBody.isActive).toEqual(true);
    expect(getResponseBody.countryCodes.at(0).id).toEqual(firstCountryCode.id);
    expect(getResponseBody.policies.at(0).id).toEqual(firstPolicy.id);
    expect(getResponseBody.onboarding.id).toEqual(firstOnboarding.id);
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
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: getResponseBody } = await request(app.getHttpServer())
      .get('/studies')
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [
          secondCountryCode.id,
          secondCountryCode.id,
          secondCountryCode.id,
        ],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id, secondPolicy.id, secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(updateStudyDescription);
    expect(updateResponseBody.isActive).toEqual(false);
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({ name: updatedStudyName })
      .expect(200);

    expect(createResponseBody.id).toEqual(updateResponseBody.id);

    expect(createResponseBody.name).toEqual(studyName);
    expect(createResponseBody.description).toEqual(studyDescription);
    expect(createResponseBody.isActive).toEqual(true);
    expect(createResponseBody.countryCodes.length).toEqual(1);
    expect(createResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createResponseBody.policies.length).toEqual(1);
    expect(createResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createResponseBody.onboarding.id).toEqual(firstOnboarding.id);

    expect(updateResponseBody.name).toEqual(updatedStudyName);
    expect(updateResponseBody.description).toEqual(studyDescription);
    expect(updateResponseBody.isActive).toEqual(true);
    expect(updateResponseBody.countryCodes.length).toEqual(1);
    expect(updateResponseBody.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(updateResponseBody.policies.length).toEqual(1);
    expect(updateResponseBody.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(updateResponseBody.onboarding.id).toEqual(firstOnboarding.id);
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
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
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: ['Invalid id format'],
      })
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
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      })
      .expect(201);

    const { body: updateResponseBody } = await request(app.getHttpServer())
      .patch(`/studies/${createResponseBody.id}`)
      .send({
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: 'Invalid Id Format',
        formId: secondStudyForm.id,
      })
      .expect(400);

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
        isActive: true,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
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
