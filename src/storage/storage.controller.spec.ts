import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { fakeStorageService } from 'src/utils/fake-storage-service.util';

describe('StorageController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [{ provide: StorageService, useValue: fakeStorageService }],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created file', async () => {
    const createdEntity = await controller.uploadRecording(
      {} as Express.Multer.File,
    );

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toEqual('Test File Id');
  });
});
