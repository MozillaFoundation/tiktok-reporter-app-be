import { DownloadResponse, Storage } from '@google-cloud/storage';

import { Injectable } from '@nestjs/common';
import StorageConfig from './config/storage-config';
import { StorageFile } from './types/storage-file';
import { getFileExtension } from 'src/utils/file.utils';
import { getFormattedDateForStorage } from 'src/utils/date.utils';
import { mapFileToDtos } from './mappers/mapEntitiesToDto';
import { randomUuidv4 } from 'src/utils/generate-uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }

  async save(file: Express.Multer.File) {
    const fileExt = getFileExtension(file.originalname);
    const folderName = getFormattedDateForStorage();
    const randomFileName = randomUuidv4();
    const filePath = `${folderName}/${randomFileName}.${fileExt}`;

    const newFile = this.storage.bucket(this.bucket).file(filePath);

    const stream = newFile.createWriteStream();

    stream.end(file.buffer);

    return mapFileToDtos(newFile);
    //return newFile;
  }

  async getFile(path: string): Promise<DownloadResponse> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return fileResponse;
  }
}
