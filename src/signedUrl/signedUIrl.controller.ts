import { Controller, Get, UseInterceptors, Headers } from '@nestjs/common';
import { SentryInterceptor } from '../interceptors/sentry.interceptor';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignedUrlService } from './signedUrl.service';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';

@UseInterceptors(SentryInterceptor)
@ApiTags('SignedUrl')
@Controller('signedUrl')
export class SignedUrlController {
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
  async getSignedUrl(@Headers() headers) {
    return await this.signedUrlService.getUrl(
      headers[API_KEY_HEADER_VALUE] as string,
    );
  }
}
