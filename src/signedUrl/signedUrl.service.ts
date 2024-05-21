import {
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import storageConfig, { mediaBucket } from '../storage/config/storage-config';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { getFormattedDateForStorage } from '../utils/date.utils';
import { randomUuidv4 } from '../utils/generate-uuid';
import { mapUrlToDto } from './mappers/mapUrlToDto';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Injectable()
export class SignedUrlService {
  private storage: Storage;
  private bucket: string;

  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {
    this.storage = new Storage(storageConfig);
    this.bucket = mediaBucket;
  }
  @UseInterceptors(LoggingInterceptor)
  async getUrl(headerApiKey: string) {
    if (!headerApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    if (!savedApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'video/mp4',
    };

    const folderName = getFormattedDateForStorage();
    const randomFileName = randomUuidv4();
    const filePath = `${folderName}/${randomFileName}.mp4`;

    const [url] = await this.storage
      .bucket(this.bucket)
      .file(filePath)
      .getSignedUrl(options);

    return mapUrlToDto(url);
  }
}
