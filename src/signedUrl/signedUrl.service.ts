import { Injectable, UseInterceptors } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import StorageConfig from '../storage/config/storage-config';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { getFormattedDateForStorage } from '../utils/date.utils';
import { randomUuidv4 } from '../utils/generate-uuid';

@Injectable()
export class SignedUrlService {
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
  async getUrl() {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 1500 * 60 * 1000, // 15 minutes
      contentType: 'video/mp4',
    };

    const folderName = getFormattedDateForStorage();
    const randomFileName = randomUuidv4();
    const filePath = `${folderName}/${randomFileName}.mp4`;

    const [url] = await this.storage
      .bucket(this.bucket)
      .file(filePath)
      .getSignedUrl(options);

    return url.replace(
      'https://storage.googleapis.com/regrets_reporter_recording_docs/',
      '',
    );
  }
}
