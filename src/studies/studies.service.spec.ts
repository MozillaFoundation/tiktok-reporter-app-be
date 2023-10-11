import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
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
          provide: STUDY_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
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
});
