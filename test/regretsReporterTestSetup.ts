import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';

export class RegretsReporterTestSetup {
  private static instance: RegretsReporterTestSetup;
  private app: INestApplication;
  private constructor() {}

  public static getInstance(): RegretsReporterTestSetup {
    if (!RegretsReporterTestSetup.instance) {
      RegretsReporterTestSetup.instance = new RegretsReporterTestSetup();
    }

    return RegretsReporterTestSetup.instance;
  }

  public async getApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
    return this.app;
  }
}
