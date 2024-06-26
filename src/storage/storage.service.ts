import { DownloadResponse, Storage } from '@google-cloud/storage';

import { Injectable, UseInterceptors } from '@nestjs/common';
import storageConfig, { mediaBucket } from './config/storage-config';
import { StorageFile } from './types/storage-file';
import { StorageFileDto } from './dtos/storage-file.dto';
import { getFileExtension } from 'src/utils/file.utils';
import { getFormattedDateForStorage } from 'src/utils/date.utils';
import { mapFileToDto } from './mappers/mapEntitiesToDto';
import { randomUuidv4 } from 'src/utils/generate-uuid';
import * as Sentry from '@sentry/node';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage(storageConfig);
    this.bucket = mediaBucket;
  }
  @UseInterceptors(LoggingInterceptor)
  async save(file: Express.Multer.File): Promise<StorageFileDto> {
    const fileExt = getFileExtension(file.mimetype);
    const folderName = getFormattedDateForStorage();
    const randomFileName = randomUuidv4();
    const filePath = `${folderName}/${randomFileName}.${fileExt}`;
    const newFile = this.storage.bucket(this.bucket).file(filePath);

    const stream = newFile.createWriteStream({ resumable: false });
    stream.on('error', (error) => {
      Sentry.captureException(error);
    });
    stream.end(file.buffer);

    return mapFileToDto(newFile);
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
