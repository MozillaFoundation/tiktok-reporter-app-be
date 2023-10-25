import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateCountryCodeDto,
  defaultCreateFormDto,
  defaultCreateOnboardingDto,
  defaultCreateOnboardingStepDto,
  defaultCreatePolicyDto,
  defaultCreateStudyDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { Form } from 'src/forms/entities/form.entity';
import { FormsService } from 'src/forms/forms.service';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { PoliciesService } from 'src/policies/policies.service';
import { Policy } from 'src/policies/entities/policy.entity';
import { PolicyType } from 'src/types/policy.type';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakeFormsService } from 'src/utils/fake-forms-service.util';
import { fakeOnboardingStepsService } from 'src/utils/fake-onboarding-steps-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudiesService', () => {
  let service: StudiesService;
  let repository: Repository<Study>;
  const REPOSITORY_TOKEN = getRepositoryToken(Study);
  let firstCountryCode: CountryCode;
  let secondCountryCode: CountryCode;
  let firstPolicy: Policy;
  let secondPolicy: Policy;
  let firstOnboarding: Onboarding;
  let secondOnboarding: Onboarding;
  let firstStudyForm: Form;
  let secondStudyForm: Form;

  beforeAll(async () => {
    firstCountryCode = await fakeCountryCodesService.create(
      defaultCreateCountryCodeDto,
    );
    secondCountryCode = await fakeCountryCodesService.create({
      countryCode: 'Test Second Country Code',
      countryName: 'Test Second Country Code Name',
    });

    firstPolicy = await fakePoliciesService.create(defaultCreatePolicyDto);
    secondPolicy = await fakePoliciesService.create({
      type: PolicyType.PrivacyPolicy,
      title: 'Test Second Policy Title',
      subtitle: 'Test Second Policy SubTitle',
      text: 'Test Second Policy Text',
    });

    firstStudyForm = await fakeFormsService.create(defaultCreateFormDto);
    secondStudyForm = await fakeFormsService.create(defaultCreateFormDto);

    const firstOnboardingStep = await fakeOnboardingStepsService.create(
      defaultCreateOnboardingStepDto,
    );

    firstOnboarding = await fakeOnboardingsService.create({
      ...defaultCreateOnboardingDto,
      stepIds: [firstOnboardingStep.id],
      formId: firstStudyForm.id,
    });

    const secondOnboardingStep = await fakeOnboardingStepsService.create({
      title: 'Test Second Onboarding Step Title',
      subtitle: 'Test Second Onboarding Step SubTitle',
      description: 'Test Second Onboarding Step Description',
      imageUrl: 'Test Second Onboarding Step ImageURL',
      details: 'Test Second Onboarding Step Details',
      order: 1,
    });

    secondOnboarding = await fakeOnboardingsService.create({
      name: 'Test Second Onboarding Step Name',
      stepIds: [secondOnboardingStep.id],
      formId: secondStudyForm.id,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: PoliciesService, useValue: fakePoliciesService },
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
        { provide: FormsService, useValue: fakeFormsService },
        {
          provide: REPOSITORY_TOKEN,
          useValue: getFakeEntityRepository<Study>(),
        },
      ],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
    repository = module.get<Repository<Study>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have studyRepository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(createdEntity.isActive).toEqual(
      defaultCreateStudyDto.isActive,
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
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [
        firstCountryCode.id,
        firstCountryCode.id,
        firstCountryCode.id,
      ],
      policyIds: [firstPolicy.id, firstPolicy.id, firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(createdEntity.isActive).toEqual(
      defaultCreateStudyDto.isActive,
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
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent policy id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: firstOnboarding.id,
        formId: firstStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent onboarding id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: firstStudyForm.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('create throws error if non existent form id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [firstCountryCode.id],
        policyIds: [firstPolicy.id],
        onboardingId: firstOnboarding.id,
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const allStudies = await service.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);
    await expect(allStudies).toContain(createdEntity);
  });

  it('findOne returns newly created study', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const foundEntity = await service.findOne(createdEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(createdEntity);
    await expect(foundEntity.countryCodes).toBeDefined();
  });

  it('findOne throws error when no study was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findByCountryCode returns newly created study when querying by id', async () => {
    const newCreatedStudy = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const foundEntities = await service.findByCountryCode(firstCountryCode.id);

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('findByCountryCode returns newly created study when querying by country code value', async () => {
    const newCreatedStudy = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const foundEntities = await service.findByCountryCode(
      firstCountryCode.code,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('findByCountryCode returns all studies when no study can be found', async () => {
    const newCreatedStudy = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const foundEntities = await service.findByCountryCode(
      'Non existent country code',
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities.map((s) => s.id)).toEqual([newCreatedStudy.id]);
  });

  it('update returns the updated study with all changes updated', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    const updatedEntity = await service.update(createdEntity.id, {
      name: updatedStudyName,
      description: updateStudyDescription,
      isActive: false,
      countryCodeIds: [secondCountryCode.id],
      policyIds: [secondPolicy.id],
      onboardingId: secondOnboarding.id,
      formId: secondStudyForm.id,
    });

    expect(updatedEntity.name).toEqual(updatedStudyName);
    expect(updatedEntity.description).toEqual(updateStudyDescription);
    expect(updatedEntity.isActive).toEqual(false);
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
    const createdEntity = await service.create(entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(createdEntity.id, {
      name: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.name).toEqual(updatedName);
    await expect(updatedEntity.description).toEqual(entityDto.description);
    await expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual(
      entityDto.countryCodeIds,
    );
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error when invalid country codes are provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error when invalid policy is provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: secondOnboarding.id,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update throws error when invalid onboarding is provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: DEFAULT_GUID,
        formId: secondStudyForm.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update throws error when invalid form is provided', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
    });

    const updatedStudyName = 'UPDATE Test Create Third Study';
    const updateStudyDescription = 'UPDATE Test Create Third Study DESCRIPTION';
    await expect(
      service.update(createdEntity.id, {
        name: updatedStudyName,
        description: updateStudyDescription,
        isActive: false,
        countryCodeIds: [secondCountryCode.id],
        policyIds: [secondPolicy.id],
        onboardingId: secondOnboarding.id,
        formId: DEFAULT_GUID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [firstCountryCode.id],
      policyIds: [firstPolicy.id],
      onboardingId: firstOnboarding.id,
      formId: firstStudyForm.id,
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
