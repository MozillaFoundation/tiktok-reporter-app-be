import { StorageFileDto } from 'src/storage/dtos/storage-file.dto';
import { StorageService } from 'src/storage/storage.service';

export const fakeStorageService: Partial<StorageService> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save: async (file: Express.Multer.File): Promise<StorageFileDto> => {
    return {
      id: 'Test File Id',
      name: 'Test File Name',
      bucketName: 'Test Bucket Name',
      storageUrl: 'Test Storage Url',
    };
  },
};
