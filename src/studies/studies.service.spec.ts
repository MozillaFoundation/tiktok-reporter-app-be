import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DEFAULT_GUID,
  DEFAULT_IP_ADDRESS_FOR_TESTING,
  defaultCreateCountryCodeDto,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
  defaultCreatePolicyDto,
  defaultCreateStudyDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { CountryCodeDto } from 'src/countryCodes/dtos/country-code.dto';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { FormDto } from 'src/forms/dtos/form.dto';
import { FormsService } from 'src/forms/forms.service';
import { GeolocationService } from 'src/geolocation/geo-location.service';
import { OnboardingDto } from 'src/onboardings/dtos/onboarding.dto';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { PoliciesService } from 'src/policies/policies.service';
import { PolicyDto } from 'src/policies/dtos/policy.dto';
import { PolicyType } from 'src/policies/entities/policy.entity';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { fakeGeolocationService } from 'src/utils/fake-geo-location-service.util';
import {
  fakeOnboardingStepsService,
  fakeOnboardingStepRepository,
} from 'src/utils/fake-onboarding-steps-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OnboardingStepDto } from 'src/onboardingSteps/dtos/onboarding-step.dto';
import { MobilePlatform } from 'src/interceptors/request-context.interceptor';

describe('StudiesService', () => {
  let service: StudiesService;
  let repository: Repository<Study>;
  let apiKeyRepository: Repository<ApiKey>;
  let configService: ConfigService;

  const REPOSITORY_TOKEN = getRepositoryToken(Study);
  const ONBOARDING_STEP_REPOSITORY_TOKEN = getRepositoryToken(OnboardingStep);
  const API_KEY_REPOSITORY_TOKEN = getRepositoryToken(ApiKey);

  let apiKey: string;
  let firstCountryCode: CountryCodeDto;
  let secondCountryCode: CountryCodeDto;
  let firstPolicy: PolicyDto;
  let secondPolicy: PolicyDto;
  let firstOnboarding: OnboardingDto;
  let firstOnboardingStep: OnboardingStepDto;
  let secondOnboardingStepAndroid: OnboardingStepDto;
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

    firstOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      defaultCreateOnboardingStepDto,
    );

    secondOnboardingStepAndroid = await fakeOnboardingStepsService.create(
      apiKey,
      {
        title: 'Test Android Onboarding Step Title',
        platform: 'android',
        subtitle: 'Test Android Onboarding Step SubTitle',
        description: 'Test Android Onboarding Step Description',
        imageUrl: 'Test Android Onboarding Step ImageURL',
        details: 'Test Android Onboarding Step Details',
        order: 2,
      },
    );

    firstOnboarding = await fakeOnboardingsService.create(apiKey, {
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id, secondOnboardingStepAndroid.id],
      formId: firstStudyForm.id,
    });

    // Need to set this manually, else the steps are not filtered
    // correctly by onboarding platform. Is there a better way?
    await fakeOnboardingStepRepository.save({
      ...firstOnboardingStep,
      onboardings: [firstOnboarding],
    });
    firstOnboardingStep.onboardings = [firstOnboarding];
    await fakeOnboardingStepRepository.save({
      ...secondOnboardingStepAndroid,
      onboardings: [firstOnboarding],
    });
    secondOnboardingStepAndroid.onboardings = [firstOnboarding];

    const secondOnboardingStep = await fakeOnboardingStepsService.create(
      apiKey,
      {
        title: 'Test Second Onboarding Step Title',
        platform: MobilePlatform.IOS,
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

    await fakeOnboardingStepRepository.save({
      ...secondOnboardingStep,
      onboardings: [secondOnboarding],
    });
    secondOnboardingStep.onboardings = [secondOnboarding];
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        StudiesService,
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: PoliciesService, useValue: fakePoliciesService },
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
        { provide: FormsService, useValue: fakeFormsService },
        { provide: GeolocationService, useValue: fakeGeolocationService },
        {
          provide: REPOSITORY_TOKEN,
          useValue: getFakeEntityRepository<Study>(),
        },
        {
          provide: ONBOARDING_STEP_REPOSITORY_TOKEN,
          useValue: fakeOnboardingStepRepository,
        },
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
    repository = module.get<Repository<Study>>(REPOSITORY_TOKEN);
    initApiKey(module);
  });

  function initApiKey(module: TestingModule) {
    apiKeyRepository = module.get<Repository<ApiKey>>(API_KEY_REPOSITORY_TOKEN);
    configService = module.get<ConfigService>(ConfigService);
    apiKey = configService.get<string>('API_KEY');

    const createdApiKey = apiKeyRepository.create({
      key: apiKey,
      appName: 'Dev Testing',
    });
    apiKeyRepository.save(createdApiKey);
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have studyRepository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

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
    expect(createdEntity.form.id).toEqual(firstStudyForm.id);
  });

  it('create returns the newly created study with no duplicate country codes or policies', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [
        firstCountryCode.id,
        firstCountryCode.id,
        firstCountryCode.id,
      ],
      policyIds: [firstPolicy.id, firstPolicy.id, firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

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
      service.create(apiKey, {
        ...defaultCreateStudyDto,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
        dataDownloadFormId: firstStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent policy id is provided', async () => {
    await expect(
      service.create(apiKey, {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
        dataDownloadFormId: firstStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent onboarding id is provided', async () => {
    await expect(
      service.create(apiKey, {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: firstStudyForm.id,
        dataDownloadFormId: firstStudyForm.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('create throws error if non existent form id is provided', async () => {
    await expect(
      service.create(apiKey, {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: DEFAULT_GUID,
        dataDownloadFormId: firstStudyForm.id,
      }),
    ).rejects.toThrow(NotFoundException);

    await expect(
      service.create(apiKey, {
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
        dataDownloadFormId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const allStudies = await service.findAll();

    expect(allStudies).toBeDefined();
    expect(allStudies.length).toBeGreaterThan(0);
    expect(allStudies).toEqual(expect.arrayContaining([createdEntity]));
  });

  it('findOne returns newly created study with platform specific steps', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const foundEntity = await service.findOne(createdEntity.id, null);

    expect(foundEntity).toBeDefined();
    expect(foundEntity.countryCodes).toBeDefined();
    expect(foundEntity.onboarding.steps.length).toEqual(1);
    // Exclude the android-specific step
    expect(foundEntity).toEqual({
      ...createdEntity,
      onboarding: {
        ...createdEntity.onboarding,
        steps: [firstOnboardingStep],
      },
    });

    const foundEntityForAndroid = await service.findOne(
      createdEntity.id,
      MobilePlatform.ANDROID,
    );

    expect(foundEntityForAndroid).toBeDefined();
    expect(foundEntityForAndroid.onboarding.steps.length).toEqual(2);
    expect(foundEntityForAndroid).toEqual({
      ...createdEntity,
      onboarding: {
        ...createdEntity.onboarding,
        steps: [firstOnboardingStep, secondOnboardingStepAndroid],
      },
    });
  });

  it('findOne throws error when no study was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findByIpAddress returns newly created study when querying by id', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const foundEntities = await service.findByIpAddress(
      DEFAULT_IP_ADDRESS_FOR_TESTING,
      MobilePlatform.IOS,
    );

    expect(foundEntities).toBeDefined();
    const foundEntity = foundEntities.find((s) => s.id === createdEntity.id);
    // Remove onboardings from steps as they are not set in the fake repository
    for (const step of foundEntity.onboarding.steps) {
      step.onboardings = [];
    }
    createdEntity.onboarding.steps = createdEntity.onboarding.steps.filter(
      (s) => s.platform !== MobilePlatform.ANDROID,
    );
    expect(foundEntity).toEqual(createdEntity);  });

  it('findByIpAddress returns newly created study when querying by country code value', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const foundEntities = await service.findByIpAddress(
      DEFAULT_IP_ADDRESS_FOR_TESTING,
      MobilePlatform.IOS,
    );

    expect(foundEntities).toBeDefined();
    const foundEntity = foundEntities.find((s) => s.id === createdEntity.id);
    // Remove onboardings from steps as they are not set in the fake repository
    for (const step of foundEntity.onboarding.steps) {
      step.onboardings = [];
    }
    createdEntity.onboarding.steps = createdEntity.onboarding.steps.filter(
      (s) => s.platform !== MobilePlatform.ANDROID,
    );
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findByIpAddress returns global study whether there is a country study or not', async () => {
    const countryStudy = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });
    // countryCodes is used by the query filter and fake repository doesn't set it
    await repository.save({
      ...countryStudy,
      countryCodes: [firstCountryCode],
    });

    const anotherCountryStudy = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [secondCountryCode.id],
      policyIds: [secondPolicy.id],
      onboardingId: secondOnboarding.id,
      formId: secondStudyForm.id,
      dataDownloadFormId: secondStudyForm.id,
    });
    await repository.save({
      ...anotherCountryStudy,
      countryCodes: [secondCountryCode],
    });
    const globalStudy = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      // Explicitly set no countries
      countryCodeIds: [],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });
    await repository.save({
      ...globalStudy,
      countryCodes: [],
    });

    const foundEntitiesNoCountry = await service.findByIpAddress(
      'Non existent ip address',
      MobilePlatform.IOS,
    );

    expect(foundEntitiesNoCountry).toBeDefined();
    expect(foundEntitiesNoCountry.map((s) => s.id)).toEqual([globalStudy.id]);
    const foundEntities = await service.findByIpAddress(
      DEFAULT_IP_ADDRESS_FOR_TESTING,
      MobilePlatform.IOS,
    );

    expect(foundEntities).toBeDefined();
    expect(foundEntities.map((s) => s.id)).toEqual([
      countryStudy.id,
      globalStudy.id,
    ]);
  });

  it('update returns the updated study with all changes updated', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      name: updatedStudyName,
      description: updateStudyDescription,
      isActive: false,
      supportsRecording: false,
      countryCodeIds: [secondCountryCode.id],
      policyIds: [secondPolicy.id],
      onboardingId: secondOnboarding.id,
      formId: secondStudyForm.id,
    });

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
      dataDownloadFormId: firstStudyForm.id,
    };
    const createdEntity = await service.create(apiKey, entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(apiKey, createdEntity.id, {
      name: updatedName,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.name).toEqual(updatedName);
    expect(updatedEntity.description).toEqual(entityDto.description);
    expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual(
      entityDto.countryCodeIds,
    );
  });

  it('update throws error when no study was found', async () => {
    await expect(
      service.update(apiKey, DEFAULT_GUID, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error when invalid country codes are provided', async () => {
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(apiKey, createdEntity.id, {
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
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(apiKey, createdEntity.id, {
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
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(apiKey, createdEntity.id, {
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
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(apiKey, createdEntity.id, {
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
    const createdEntity = await service.create(apiKey, {
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
      dataDownloadFormId: firstStudyForm.id,
    });

    const removedEntity = await service.remove(createdEntity.id);
    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no study was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
