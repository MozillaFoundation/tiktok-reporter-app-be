import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudyDto } from './dto/create-study.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { fakeStudyRepositoryProvider } from 'src/utils/fake-studies-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudiesService', () => {
  let service: StudiesService;
  let studyRepository: Repository<Study>;
  const STUDY_REPOSITORY_TOKEN = getRepositoryToken(Study);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        {
          ...fakeStudyRepositoryProvider,
        },
      ],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
    studyRepository = module.get<Repository<Study>>(STUDY_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have studyRepository defined', () => {
    expect(studyRepository).toBeDefined();
  });
  it('create returns the newly created study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Create Study';

    const createdStudy = await service.create(createStudyDto);

    await expect(createdStudy).toBeDefined();
    await expect(createdStudy.id).toBeDefined();
    await expect(createdStudy.name).toEqual(createStudyDto.name);
  });
  it('findAll returns the list of all studies including the newly created one', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Find All Studies';
    const newCreatedStudy = await service.create(createStudyDto);

    const allStudies = await service.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);

    await expect(allStudies).toContain(newCreatedStudy);
  });

  it('findOne returns newly created study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Find One Study';
    const newCreatedStudy = await service.create(createStudyDto);

    const foundStudy = await service.findOne(newCreatedStudy.id);

    await expect(foundStudy).toBeDefined();
    await expect(foundStudy).toEqual(newCreatedStudy);
  });

  it('update returns the updated study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Update Study';
    const newCreatedStudy = await service.create(createStudyDto);
    const updatedName = 'UPDATED Test Update Study';

    const updatedStudy = await service.update(newCreatedStudy.id, {
      name: updatedName,
    });

    await expect(updatedStudy).toBeDefined();
    await expect(updatedStudy.name).toEqual(updatedName);
    await expect(updatedStudy).toEqual(newCreatedStudy);
  });

  it('update throws error when no study was found', async () => {
    await expect(
      service.update(12, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Delete Study';
    const newCreatedStudy = await service.create(createStudyDto);

    const removedStudy = await service.remove(newCreatedStudy.id);
    const foundRemovedStudy = await service.findOne(removedStudy.id);

    await expect(foundRemovedStudy).not.toBeDefined();
  });

  it('remove throws error when no study was found', async () => {
    await expect(service.remove(12)).rejects.toThrow(NotFoundException);
  });
});
