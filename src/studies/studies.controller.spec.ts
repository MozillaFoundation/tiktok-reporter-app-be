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
import { Policy } from 'src/policies/entities/policy.entity';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakeOnboardingsService } from 'src/utils/fake-onboardings-service.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';
import { fakeStudiesService } from 'src/utils/fake-studies-service.util';

describe('StudiesController', () => {
  let controller: StudiesController;
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
      controllers: [StudiesController],
      providers: [
        { provide: StudiesService, useValue: fakeStudiesService },
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: OnboardingsService, useValue: fakeOnboardingsService },
      ],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const createdEntity = await controller.create({
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

  it('create throws error if non existent country code id is provided', async () => {
    await expect(
      controller.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [DEFAULT_GUID],
        policyIds: [policyForTest.id],
        onboardingId: onboardingForTest.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create throws error if non existent policy id is provided', async () => {
    await expect(
      controller.create({
        ...defaultCreateStudyDto,
        countryCodeIds: [countryCodeForTest.id],
        policyIds: [DEFAULT_GUID],
        onboardingId: onboardingForTest.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const createdEntity = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const allStudies = await controller.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);

    await expect(allStudies).toContain(createdEntity);
  });

  it('findOne returns newly created study', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const foundEntity = await controller.findOne(newCreatedStudy.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(newCreatedStudy);
  });

  it('findOne throws error when no study was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findByCountryCode returns newly created study when querying by id', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const foundEntities = await controller.findByCountryCode(
      countryCodeForTest.id,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('findByCountryCode returns newly created study when querying by country code value', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const foundEntities = await controller.findByCountryCode(
      countryCodeForTest.code,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('update returns the updated study with all changes updated', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });
    const updatedName = 'UPDATED Test Update Study';

    const updatedStudy = await controller.update(newCreatedStudy.id, {
      name: updatedName,
    });

    await expect(updatedStudy).toBeDefined();
    await expect(updatedStudy.name).toEqual(updatedName);
    await expect(updatedStudy).toEqual(newCreatedStudy);
  });

  it('update returns the updated study with all changes updated and no duplicate coutnry codes or policies', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [
        countryCodeForTest.id,
        countryCodeForTest.id,
        countryCodeForTest.id,
      ],
      policyIds: [policyForTest.id, policyForTest.id, policyForTest.id],
      onboardingId: onboardingForTest.id,
    });
    const updatedName = 'UPDATED Test Update Study';

    const updatedStudy = await controller.update(newCreatedStudy.id, {
      name: updatedName,
    });

    await expect(updatedStudy).toBeDefined();
    await expect(updatedStudy.name).toEqual(updatedName);
    await expect(updatedStudy.countryCodes.length).toEqual(1);
    await expect(updatedStudy.policies.length).toEqual(1);
    await expect(updatedStudy).toEqual(newCreatedStudy);
  });

  it('update returns the updated study with the partial changes updated', async () => {
    const entityDto = {
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    };
    const newCreatedStudy = await controller.create(entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedStudy = await controller.update(newCreatedStudy.id, {
      name: updatedName,
    });

    await expect(updatedStudy).toBeDefined();
    await expect(updatedStudy.name).toEqual(updatedName);
    await expect(updatedStudy.description).toEqual(entityDto.description);
    await expect(updatedStudy.countryCodes.map((cc) => cc.id)).toEqual(
      entityDto.countryCodeIds,
    );
    await expect(updatedStudy).toEqual(newCreatedStudy);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      controller.update(DEFAULT_GUID, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const newCreatedStudy = await controller.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
      onboardingId: onboardingForTest.id,
    });

    const removedStudy = await controller.remove(newCreatedStudy.id);
    await expect(controller.findOne(removedStudy.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no study was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
