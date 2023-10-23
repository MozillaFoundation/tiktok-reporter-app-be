import { Controller, Get, Ip } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Ip() ip, @RealIP() realIp: string): string {
    return `${this.appService.getHello()}: IP ** ${ip} ** RealIP: ** ${realIp} **`;
  }
}
