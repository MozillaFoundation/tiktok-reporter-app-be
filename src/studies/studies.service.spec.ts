import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateCountryCodeDto,
  defaultCreateOnboardingDto,
  defaultCreatePolicyDto,
  defaultCreateStudyDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { PoliciesService } from 'src/policies/policies.service';
import { Policy } from 'src/policies/entities/policy.entity';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.spec.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.spec.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service..spec.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.spec.util';
import { getRepositoryToken } from '@nestjs/typeorm';

// TODO: Handle update scenario for non existent country code, policy and onboarding ids
describe('StudiesService', () => {
  let service: StudiesService;
  let repository: Repository<Study>;
  const REPOSITORY_TOKEN = getRepositoryToken(Study);
  let countryCodeForTest: CountryCode;
  let policyForTest: Policy;
  let onboardingForTest: Onboarding;

  beforeAll(async () => {
    countryCodeForTest = await fakeCountryCodesService.create(
      defaultCreateCountryCodeDto,
    );
    policyForTest = await fakePoliciesService.create(defaultCreatePolicyDto);
    onboardingForTest = await fakeOnboardingsService.create(
      defaultCreateOnboardingDto,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: PoliciesService, useValue: fakePoliciesService },
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
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
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(createdEntity.countryCodes).toBeDefined();
    await expect(createdEntity.countryCodes.length).toBeGreaterThan(0);
    await expect(createdEntity.policies).toBeDefined();
    await expect(createdEntity.onboarding).toBeDefined();
  });

  it('create returns the newly created study with no duplicate country codes or policies', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [
        countryCodeForTest.id,
        countryCodeForTest.id,
        countryCodeForTest.id,
      ],
      policyIds: [policyForTest.id, policyForTest.id, policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(createdEntity.countryCodes).toBeDefined();
    await expect(createdEntity.countryCodes.length).toEqual(1);
    await expect(createdEntity.policies).toBeDefined();
    await expect(createdEntity.policies.length).toEqual(1);
    await expect(createdEntity.onboarding).toBeDefined();
  });

  it('create throws error if non existent country code id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [policyForTest.id],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent policy id is provided', async () => {
    await expect(
      service.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [countryCodeForTest.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: onboardingForTest.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const allStudies = await service.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);
    await expect(allStudies).toContain(createdEntity);
  });

  it('findOne returns newly created study', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
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
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const foundEntities = await service.findByCountryCode(
      countryCodeForTest.id,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('findByCountryCode returns newly created study when querying by country code value', async () => {
    const newCreatedStudy = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const foundEntities = await service.findByCountryCode(
      countryCodeForTest.code,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('update returns the updated study with all changes updated', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(createdEntity.id, {
      name: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.name).toEqual(updatedName);
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated study with the partial changes updated', async () => {
    const entityDto = {
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
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

  it('remove removes the study', async () => {
    const createdEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
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
