import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { CreateStudyDto } from './dto/create-study.dto';
import { DEFAULT_GUID } from 'test/constants';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudiesService', () => {
  let service: StudiesService;
  let repository: Repository<Study>;
  const STUDY_REPOSITORY_TOKEN = getRepositoryToken(Study);
  let countryCodeForTest: CountryCode;

  beforeAll(async () => {
    const countryCodeDto = new CreateCountryCodeDto();
    countryCodeDto.countryCode = 'Test Country Code';
    countryCodeForTest = await fakeCountryCodesService.create(countryCodeDto);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
        {
          provide: STUDY_REPOSITORY_TOKEN,
          useValue: getFakeEntityRepository<Study>(),
        },
      ],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
    repository = module.get<Repository<Study>>(STUDY_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have studyRepository defined', () => {
    expect(repository).toBeDefined();
  });
  it('create returns the newly created study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Create Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [countryCodeForTest.id];

    const newCreatedEntity = await service.create(entityDto);

    await expect(newCreatedEntity).toBeDefined();
    await expect(newCreatedEntity.id).toBeDefined();
    await expect(newCreatedEntity.name).toEqual(entityDto.name);
    await expect(newCreatedEntity.description).toEqual(entityDto.description);
    await expect(newCreatedEntity.countryCodes).toBeDefined();
    await expect(newCreatedEntity.countryCodes.length).toBeGreaterThan(0);
  });
  it('create throws error if invalid country code id is provided', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Create Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [DEFAULT_GUID];

    await expect(service.create(entityDto)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('findAll returns the list of all studies including the newly created one', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Find All Studies';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [countryCodeForTest.id];

    const newCreatedEntity = await service.create(entityDto);

    const allStudies = await service.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);
    await expect(allStudies).toContain(newCreatedEntity);
  });

  it('findOne returns newly created study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Find One Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [countryCodeForTest.id];

    const newCreatedEntity = await service.create(entityDto);

    const foundEntity = await service.findOne(newCreatedEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(newCreatedEntity);
    await expect(foundEntity.countryCodes).toBeDefined();
  });

  it('update returns the updated study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Update Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [countryCodeForTest.id];

    const newCreatedEntity = await service.create(entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedEntity = await service.update(newCreatedEntity.id, {
      name: updatedName,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.name).toEqual(updatedName);
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
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Delete Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeIds = [countryCodeForTest.id];

    const newCreatedEntity = await service.create(entityDto);

    const removedEntity = await service.remove(newCreatedEntity.id);
    const foundRemovedEntity = await service.findOne(removedEntity.id);

    await expect(foundRemovedEntity).not.toBeDefined();
  });

  it('remove throws error when no study was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
