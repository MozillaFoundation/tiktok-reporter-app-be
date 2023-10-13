import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { Study } from 'src/studies/entities/study.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

let studies: Study[] = [];
const STUDY_REPOSITORY_TOKEN = getRepositoryToken(Study);

export const fakeStudyRepository: Partial<Repository<Study>> = {
  create: jest.fn().mockImplementation((newStudy: DeepPartial<Study>) => {
    const newId = Math.floor(Math.random() * 999999);

    return { ...newStudy, id: newId };
  }),
  find: jest.fn().mockImplementation(() => {
    return studies;
  }),

  findOneBy: jest
    .fn()
    .mockImplementation(
      (where: FindOptionsWhere<Study> | FindOptionsWhere<Study>[]) => {
        const foundStudy = studies.find((study) => study.id === where?.['id']);

        return foundStudy;
      },
    ),
  save: jest.fn().mockImplementation((newStudy: DeepPartial<Study>) => {
    const foundStudyIndex = studies.findIndex(
      (study) => study.id === newStudy.id,
    );

    if (foundStudyIndex >= 0) {
      studies[foundStudyIndex] = {
        ...studies[foundStudyIndex],
        ...newStudy,
      } as Study;
      return studies[foundStudyIndex];
    }

    studies.push(newStudy as Study);

    return newStudy;
  }),

  remove: jest.fn().mockImplementation((studyToDelete: DeepPartial<Study>) => {
    const foundStudy = studies.find((study) => study.id === studyToDelete.id);

    studies = studies.filter((study) => study.id !== studyToDelete.id);

    return Promise.resolve(foundStudy);
  }),
};

export const fakeStudyRepositoryProvider = {
  provide: STUDY_REPOSITORY_TOKEN,
  useValue: { ...fakeStudyRepository },
};
