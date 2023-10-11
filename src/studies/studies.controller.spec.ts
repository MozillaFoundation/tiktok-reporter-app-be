import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudyDto } from './dto/create-study.dto';
import { NotFoundException } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { UpdateStudyDto } from './dto/update-study.dto';

describe('StudiesController', () => {
  let controller: StudiesController;
  let studies: Study[] = [];
  let fakeStudiesService: Partial<StudiesService>;

  beforeEach(async () => {
    fakeStudiesService = {
      create: (createStudyDto: CreateStudyDto) => {
        const newStudy = {
          id: Math.floor(Math.random() * 999999),
          name: createStudyDto.name,
        } as Study;

        studies.push(newStudy);

        return Promise.resolve(newStudy);
      },
      findAll: () => {
        return Promise.resolve(studies);
      },
      findOne: (id: number) => {
        const foundStudy = studies.find((study) => study.id === id);

        return Promise.resolve(foundStudy);
      },
      update: (id: number, updateStudyDto: UpdateStudyDto) => {
        const foundStudyIndex = studies.findIndex((study) => study.id === id);

        if (!foundStudyIndex) {
          throw new NotFoundException('Study not found');
        }
        studies[foundStudyIndex] = {
          ...studies[foundStudyIndex],
          ...updateStudyDto,
        } as Study;

        return Promise.resolve(studies.at(foundStudyIndex));
      },
      remove: (id: number) => {
        const foundStudy = studies.find((study) => study.id === id);

        if (!foundStudy) {
          throw new NotFoundException('Study not found');
        }

        studies = studies.filter((study) => study.id !== id);
        return Promise.resolve(foundStudy);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudiesController],
      providers: [{ provide: StudiesService, useValue: fakeStudiesService }],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
