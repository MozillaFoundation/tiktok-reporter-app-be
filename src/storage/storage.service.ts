import { DownloadResponse, Storage } from '@google-cloud/storage';

import { Injectable, UseInterceptors } from '@nestjs/common';
import StorageConfig from './config/storage-config';
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
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }
  @UseInterceptors(LoggingInterceptor)
  async save(file: Express.Multer.File): Promise<StorageFileDto> {
    Sentry.captureMessage(`Starting save function, filesize: ${file.size}`);
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream',
    };
    const fileExt = getFileExtension(file.mimetype);
    const folderName = getFormattedDateForStorage();
    const randomFileName = randomUuidv4();
    const filePath = `${folderName}/${randomFileName}.${fileExt}`;
    const newFile = this.storage.bucket(this.bucket).file(filePath);
    await newFile.generateSignedPostPolicyV4(options);

    const stream = newFile.createWriteStream();
    stream.on('error', (error) => {
      Sentry.captureException(error);
    });
    stream.on('finish', async () => {
      Sentry.captureMessage('File uploaded successfully');
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
