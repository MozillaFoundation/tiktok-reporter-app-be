import {
  API_KEY_HEADER_VALUE,
  DEFAULT_GUID,
  defaultCreateCountryCodeDto,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
  defaultCreatePolicyDto,
  defaultCreateStudyDto,
} from 'src/utils/constants';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCodeDto } from 'src/countryCodes/dtos/country-code.dto';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { FormDto } from 'src/forms/dtos/form.dto';
import { OnboardingDto } from 'src/onboardings/dtos/onboarding.dto';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { PolicyDto } from 'src/policies/dtos/policy.dto';
import { PolicyType } from 'src/policies/entities/policy.entity';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';
import { fakeStudiesService } from 'src/utils/fake-studies-service.util';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { MobilePlatform } from 'src/interceptors/request-context.interceptor';

describe('StudiesController', () => {
  let controller: StudiesController;
  let configService: ConfigService;
  let apiKey: string;

  let firstCountryCode: CountryCodeDto;
  let secondCountryCode: CountryCodeDto;
  let firstPolicy: PolicyDto;
  let secondPolicy: PolicyDto;
  let firstOnboarding: OnboardingDto;
  let secondOnboarding: OnboardingDto;
  let firstStudyForm: FormDto;
  let secondStudyForm: FormDto;

  beforeAll(async () => {
    firstCountryCode = await fakeCountryCodesService.create(
      apiKey,
      defaultCreateCountryCodeDto,
    );
    secondCountryCode = await fakeCountryCodesService.create(apiKey, {
      countryCode: 'Test Second Country Code',
      countryName: 'Test Second Country Code Name',
    });
    firstPolicy = await fakePoliciesService.create(
      apiKey,
      defaultCreatePolicyDto,
    );
    secondPolicy = await fakePoliciesService.create(apiKey, {
      type: PolicyType.PrivacyPolicy,
      title: 'Test Second Policy Title',
      subtitle: 'Test Second Policy SubTitle',
      text: 'Test Second Policy Text',
    });

    firstStudyForm = await fakeFormsService.create(
      apiKey,
      defaultCreateFormDto,
    );
    secondStudyForm = await fakeFormsService.create(
      apiKey,
      defaultCreateFormDto,
    );

    const firstOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    firstOnboarding = await fakeOnboardingsService.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstStudyForm.id,
    });

    const secondOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      {
        title: 'Test Second Onboarding Step Title',
        platform: null,
        subtitle: 'Test Second Onboarding Step SubTitle',
        description: 'Test Second Onboarding Step Description',
        imageUrl: 'Test Second Onboarding Step ImageURL',
        details: 'Test Second Onboarding Step Details',
        order: 1,
      },
    );

    secondOnboarding = await fakeOnboardingsService.create(apiKey, {
      name: 'Test Second Onboarding Step Name',
      stepIds: [secondOnboardingStep.id],
      formId: secondStudyForm.id,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      controllers: [StudiesController],
      providers: [
        { provide: StudiesService, useValue: fakeStudiesService },
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
        {
          provide: OnboardingStepsService,
          useValue: fakeOnboardingStepsService,
        },
      ],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
    configService = module.get<ConfigService>(ConfigService);
    const studiesService = module.get<StudiesService>(StudiesService);
    await studiesService?.['initApiKey']();

    apiKey = configService.get<string>('API_KEY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    expect(createdEntity.isActive).toEqual(defaultCreateStudyDto.isActive);
    expect(createdEntity.supportsRecording).toEqual(
      defaultCreateStudyDto.supportsRecording,
    );

    expect(createdEntity.countryCodes.length).toEqual(1);
    expect(createdEntity.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createdEntity.policies.length).toEqual(1);
    expect(createdEntity.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
    ]);
    expect(createdEntity.onboarding.id).toEqual(firstOnboarding.id);
  });

  it('create throws error if non existent country code id is provided', async () => {
    await expect(
      controller.create(
        { [API_KEY_HEADER_VALUE]: apiKey },
        {
          ...defaultCreateStudyDto,
          countryCodeIds: [DEFAULT_GUID],
          policyIds: [firstPolicy.id],
          onboardingId: firstOnboarding.id,
          formId: firstStudyForm.id,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent policy id is provided', async () => {
    await expect(
      controller.create(
        { [API_KEY_HEADER_VALUE]: apiKey },
        {
          ...defaultCreateStudyDto,
          countryCodeIds: [firstCountryCode.id],
          policyIds: [DEFAULT_GUID],
          onboardingId: firstOnboarding.id,
          formId: firstStudyForm.id,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent onboarding id is provided', async () => {
    await expect(
      controller.create(
        { [API_KEY_HEADER_VALUE]: apiKey },
        {
          ...defaultCreateStudyDto,
          countryCodeIds: [firstCountryCode.id],
          policyIds: [firstPolicy.id],
          onboardingId: DEFAULT_GUID,
          formId: firstStudyForm.id,
        },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('create throws error if non existent form id is provided', async () => {
    await expect(
      controller.create(
        { [API_KEY_HEADER_VALUE]: apiKey },
        {
          ...defaultCreateStudyDto,
          countryCodeIds: [firstCountryCode.id],
          policyIds: [firstPolicy.id],
          onboardingId: firstOnboarding.id,
          formId: DEFAULT_GUID,
        },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const allStudies = await controller.findAll();

    expect(allStudies).toBeDefined();
    expect(allStudies.length).toBeGreaterThan(0);

    expect(allStudies).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created study', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const foundEntity = await controller.findOne(
      { platform: null },
      createdEntity.id,
    );

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no study was found', async () => {
    await expect(
      controller.findOne(DEFAULT_GUID, MobilePlatform.IOS),
    ).rejects.toThrow(NotFoundException);
  });

  it('findByIpAddress returns newly created study when querying by id', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const foundEntities = await controller.findByIpAddress(
      firstCountryCode.id,
      MobilePlatform.IOS,
    );

    expect(foundEntities).toBeDefined();
    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findByIpAddress returns newly created study when querying by country code value', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const foundEntities = await controller.findByIpAddress(
      firstCountryCode.code,
      MobilePlatform.IOS,
    );

    expect(foundEntities).toBeDefined();
    expect(foundEntities).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findByIpAddress returns all studies when no study can be found', async () => {
    const newCreatedStudy = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const foundEntities = await controller.findByIpAddress(
      'Non existent country code',
      MobilePlatform.IOS,
    );
    expect(foundEntities).toBeDefined();
    expect(foundEntities.map((s) => s.id)).toContain(newCreatedStudy.id);
  });

  it('update returns the updated study with all changes updated', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      createdEntity.id,
      {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      },
    );

    expect(updatedEntity.name).toEqual(updatedStudyName);
    expect(updatedEntity.description).toEqual(updateStudyDescription);
    expect(updatedEntity.isActive).toEqual(false);
    expect(updatedEntity.supportsRecording).toEqual(false);
    expect(updatedEntity.countryCodes.length).toEqual(2);
    expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(updatedEntity.policies.length).toEqual(2);
    expect(updatedEntity.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
      secondPolicy.id,
    ]);
    expect(updatedEntity.onboarding.id).toEqual(secondOnboarding.id);
    expect(updatedEntity.form.id).toEqual(secondStudyForm.id);
  });

  it('update returns the updated study with all changes updated and no duplicate country codes or policies', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [
          firstCountryCode.id,
          firstCountryCode.id,
          firstCountryCode.id,
        ],
        policyIds: [firstPolicy.id, firstPolicy.id, firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      createdEntity.id,
      {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      },
    );

    expect(updatedEntity.name).toEqual(updatedStudyName);
    expect(updatedEntity.description).toEqual(updateStudyDescription);
    expect(updatedEntity.isActive).toEqual(false);
    expect(updatedEntity.supportsRecording).toEqual(false);
    expect(updatedEntity.countryCodes.length).toEqual(2);
    expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
      secondCountryCode.id,
    ]);
    expect(updatedEntity.policies.length).toEqual(2);
    expect(updatedEntity.policies.map((policy) => policy.id)).toEqual([
      firstPolicy.id,
      secondPolicy.id,
    ]);
    expect(updatedEntity.onboarding.id).toEqual(secondOnboarding.id);
  });

  it('update returns the updated study with the partial changes updated', async () => {
    const entityDto = {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    };
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      entityDto,
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    expect(createdEntity.isActive).toEqual(defaultCreateStudyDto.isActive);
    expect(createdEntity.supportsRecording).toEqual(
      defaultCreateStudyDto.supportsRecording,
    );
    expect(createdEntity.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(createdEntity.policies.map((cc) => cc.id)).toEqual([firstPolicy.id]);
    expect(createdEntity.onboarding.id).toEqual(firstOnboarding.id);

    const updatedName = 'UPDATED Test Update Study';
    const updatedDescription =
      'The UPDATED Description of the new Created Study';

    const updatedEntity = await controller.update(
      { [API_KEY_HEADER_VALUE]: apiKey },
      createdEntity.id,
      {
        name: updatedName,
        description: updatedDescription,
      },
    );

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity.description).toEqual(updatedDescription);
    expect(updatedEntity.isActive).toEqual(true);
    expect(updatedEntity.supportsRecording).toEqual(true);
    expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual([
      firstCountryCode.id,
    ]);
    expect(updatedEntity.policies.map((cc) => cc.id)).toEqual([firstPolicy.id]);
    expect(updatedEntity.onboarding.id).toEqual(firstOnboarding.id);
    expect(updatedEntity.form.id).toEqual(firstStudyForm.id);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, DEFAULT_GUID, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error when invalid country codes are provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error when invalid policy is provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error when invalid onboarding is provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error when invalid form is provided', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      controller.update({ [API_KEY_HEADER_VALUE]: apiKey }, createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        supportsRecording: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const createdEntity = await controller.create(
      { [API_KEY_HEADER_VALUE]: apiKey },
      {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      },
    );

    const removedEntity = await controller.remove(createdEntity.id);
    await expect(
      controller.findOne(removedEntity.id, MobilePlatform.IOS),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove throws error when no study was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
