import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudyDto } from './dto/create-study.dto';
import { NotFoundException } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { fakeStudiesService } from 'src/utils/fake-studies-service.util';

describe('StudiesController', () => {
  let controller: StudiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudiesController],
      providers: [{ provide: StudiesService, useValue: fakeStudiesService }],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Create Study';

    const newCreatedStudy = await fakeStudiesService.create(createStudyDto);

    await expect(newCreatedStudy).toBeDefined();
    await expect(newCreatedStudy.id).toBeDefined();
    await expect(newCreatedStudy.name).toEqual(createStudyDto.name);
  });
  it('findAll returns the list of all studies including the newly created one', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Find All Studies';
    const newCreatedStudy = await fakeStudiesService.create(createStudyDto);

    const allStudies = await fakeStudiesService.findAll();

    await expect(allStudies).toBeDefined();
    await expect(allStudies.length).toBeGreaterThan(0);

    await expect(allStudies).toContain(newCreatedStudy);
  });

  it('findOne returns newly created study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Find One Study';
    const newCreatedStudy = await fakeStudiesService.create(createStudyDto);

    const foundStudy = await fakeStudiesService.findOne(newCreatedStudy.id);

    await expect(foundStudy).toBeDefined();
    await expect(foundStudy).toEqual(newCreatedStudy);
  });

  it('update returns the updated study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Update Study';
    const newCreatedStudy = await fakeStudiesService.create(createStudyDto);
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
      fakeStudiesService.update(12, {
        name: 'Not Existing Study',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the study', async () => {
    const createStudyDto = new CreateStudyDto();
    createStudyDto.name = 'Test Delete Study';
    const newCreatedStudy = await fakeStudiesService.create(createStudyDto);

    const removedStudy = await fakeStudiesService.remove(newCreatedStudy.id);
    const foundRemovedStudy = await fakeStudiesService.findOne(removedStudy.id);

    await expect(foundRemovedStudy).not.toBeDefined();
  });

  it('remove throws error when no study was found', async () => {
    await expect(fakeStudiesService.remove(12)).rejects.toThrow(
      NotFoundException,
    );
  });
});
