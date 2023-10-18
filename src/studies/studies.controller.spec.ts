import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { CreateStudyDto } from './dto/create-study.dto';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { fakeCountryCodesService } from 'src/utils/fake-country-codes-service.util';
import { fakeStudiesService } from 'src/utils/fake-studies-service.util';

describe('StudiesController', () => {
  let controller: StudiesController;
  let countryCodeForTest: CountryCode;

  beforeAll(async () => {
    const countryCodeDto = new CreateCountryCodeDto();
    countryCodeDto.countryCode = 'Test Country Code';
    countryCodeForTest = await fakeCountryCodesService.create(countryCodeDto);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudiesController],
      providers: [
        { provide: StudiesService, useValue: fakeStudiesService },
        { provide: CountryCodesService, useValue: fakeCountryCodesService },
      ],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Create Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeId = countryCodeForTest.id;

    const newCreatedEntity = await fakeStudiesService.create(entityDto);

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
    entityDto.countryCodeId = '12';

    await expect(fakeStudiesService.create(entityDto)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('findAll returns the list of all studies including the newly created one', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Find All Studies';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeId = countryCodeForTest.id;

    const newCreatedEntity = await fakeStudiesService.create(entityDto);

    const allStudies = await fakeStudiesService.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);

    await expect(allStudies).toContain(newCreatedEntity);
  });

  it('findOne returns newly created study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Find One Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeId = countryCodeForTest.id;

    const newCreatedStudy = await fakeStudiesService.create(entityDto);

    const foundEntity = await fakeStudiesService.findOne(newCreatedStudy.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(newCreatedStudy);
  });

  it('update returns the updated study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Update Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeId = countryCodeForTest.id;

    const newCreatedStudy = await fakeStudiesService.create(entityDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedStudy = await fakeStudiesService.update(newCreatedStudy.id, {
      name: updatedName,
    });

    await expect(updatedStudy).toBeDefined();
    await expect(updatedStudy.name).toEqual(updatedName);
    await expect(updatedStudy).toEqual(newCreatedStudy);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      fakeStudiesService.update('12', {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const entityDto = new CreateStudyDto();
    entityDto.name = 'Test Delete Study';
    entityDto.description = 'The Description of the new Created Study';
    entityDto.countryCodeId = countryCodeForTest.id;

    const newCreatedStudy = await fakeStudiesService.create(entityDto);

    const removedStudy = await fakeStudiesService.remove(newCreatedStudy.id);
    const foundRemovedStudy = await fakeStudiesService.findOne(removedStudy.id);

    await expect(foundRemovedStudy).not.toBeDefined();
  });

  it('remove throws error when no study was found', async () => {
    await expect(fakeStudiesService.remove('12')).rejects.toThrow(
      NotFoundException,
    );
  });
});
