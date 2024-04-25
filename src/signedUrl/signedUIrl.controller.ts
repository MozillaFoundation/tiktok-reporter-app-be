import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../interceptors/sentry.interceptor';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignedUrlService } from './signedUrl.service';

@UseInterceptors(SentryInterceptor)
@ApiTags('SignedUrl')
@Controller('signedUrl')
export class SignedUIrlController {
  constructor(private readonly signedUrlService: SignedUrlService) {}

  @Get()
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    type: String,
    status: 200,
  })
  async getSignedUrl() {
    return await this.signedUrlService.getUrl();
  }
}
