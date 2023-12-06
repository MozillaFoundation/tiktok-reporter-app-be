import { Test, TestingModule } from '@nestjs/testing';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StorageService', () => {
  let service: StorageService;

  const API_KEY_REPOSITORY_TOKEN = getRepositoryToken(ApiKey);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        StorageService,
        {
          provide: API_KEY_REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<ApiKey>() },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
