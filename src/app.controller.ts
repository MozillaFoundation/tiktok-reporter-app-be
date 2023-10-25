import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { SentryInterceptor } from './interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader } from '@nestjs/swagger';

@UseInterceptors(SentryInterceptor)
@UseGuards(AuthGuard('api-key'))
@Controller()
@ApiHeader({
  name: 'X-API-KEY',
  description: 'Mandatory API Key to use the regrets reporter API',
  required: true,
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `${this.appService.getHello()}`;
  }
}
