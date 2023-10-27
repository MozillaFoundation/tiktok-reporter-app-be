import * as fs from 'fs';

import {
  Controller,
  Get,
  Header,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { HealthCheck } from '@nestjs/terminus';
import { SentryInterceptor } from './interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller()
export class AppController {
  constructor(
    private http: HttpHealthIndicator,
    private health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HttpCode(200)
  getBasicApp() {
    // This handler will return a 200 status response, this is for basic app check
  }

  @Get('__version__')
  @Header('Content-Type', 'application/json')
  getVersion(): string {
    const jsonData = fs.readFileSync('./dist/version.json', 'utf8');

    return jsonData;
  }

  @Get('__heartbeat__')
  @HealthCheck()
  getHealthCheck() {
    return this.health.check([
      async () => this.http.pingCheck('basic app check', process.env.APP_URL),
      async () => this.db.pingCheck('typeorm'),
      async () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    ]);
  }

  @Get('__lbheartbeat__')
  @HttpCode(200)
  getLoadBalancerHeaCheck() {
    // This handler will return a 200 status response, this is for load balancer checks
  }
}
