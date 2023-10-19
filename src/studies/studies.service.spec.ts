import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_GUID,
  defaultCreateCountryCodeDto,
  defaultCreatePolicyDto,
  defaultCreateStudyDto,
} from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { PoliciesService } from 'src/policies/policies.service';
import { Policy } from 'src/policies/entities/policy.entity';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

// TODO: Handle update scenario for duplicate country code ids;
describe('StudiesService', () => {
  let service: StudiesService;
  let repository: Repository<Study>;
  const REPOSITORY_TOKEN = getRepositoryToken(Study);
  let countryCodeForTest: CountryCode;
  let policyForTest: Policy;

  beforeAll(async () => {
    countryCodeForTest = await fakeCountryCodesService.create(
      defaultCreateCountryCodeDto,
    );
    policyForTest = await fakePoliciesService.create(defaultCreatePolicyDto);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        { provide: PoliciesService, useValue: fakePoliciesService },
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
    });

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(createdEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(createdEntity.countryCodes).toBeDefined();
    await expect(createdEntity.countryCodes.length).toBeGreaterThan(0);
  });

  it('create returns the newly created study with no duplicate country codes or policies', async () => {
    const newCreatedEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [
        countryCodeForTest.id,
        countryCodeForTest.id,
        countryCodeForTest.id,
      ],
      policyIds: [policyForTest.id, policyForTest.id, policyForTest.id],
    });

    await expect(newCreatedEntity).toBeDefined();
    await expect(newCreatedEntity.id).toBeDefined();
    await expect(newCreatedEntity.name).toEqual(defaultCreateStudyDto.name);
    await expect(newCreatedEntity.description).toEqual(
      defaultCreateStudyDto.description,
    );
    await expect(newCreatedEntity.countryCodes).toBeDefined();
    await expect(newCreatedEntity.countryCodes.length).toEqual(1);
    await expect(newCreatedEntity.policies).toBeDefined();
    await expect(newCreatedEntity.policies.length).toEqual(1);
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
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll returns the list of all studies including the newly created one', async () => {
    const newCreatedEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
    });

    const allStudies = await service.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);
    await expect(allStudies).toContain(newCreatedEntity);
  });

  it('findOne returns newly created study', async () => {
    const newCreatedEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
    });

    const foundEntity = await service.findOne(newCreatedEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(newCreatedEntity);
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
    });

    const foundEntities = await service.findByCountryCode(
      countryCodeForTest.code,
    );

    await expect(foundEntities).toBeDefined();
    await expect(foundEntities).toContain(newCreatedStudy);
  });

  it('update returns the updated study with all changes updated', async () => {
    const newCreatedEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
    });
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(newCreatedEntity.id, {
      name: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.name).toEqual(updatedName);
    await expect(updatedEntity).toEqual(newCreatedEntity);
  });

  it('update returns the updated study with the partial changes updated', async () => {
    const entityDto = {
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
    };
    const newCreatedEntity = await service.create(entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(newCreatedEntity.id, {
      name: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.name).toEqual(updatedName);
    await expect(updatedEntity.description).toEqual(entityDto.description);
    await expect(updatedEntity.countryCodes.map((cc) => cc.id)).toEqual(
      entityDto.countryCodeIds,
    );
    await expect(updatedEntity).toEqual(newCreatedEntity);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const newCreatedEntity = await service.create({
      ...defaultCreateStudyDto,
      countryCodeIds: [countryCodeForTest.id],
      policyIds: [policyForTest.id],
    });

    const removedEntity = await service.remove(newCreatedEntity.id);
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
