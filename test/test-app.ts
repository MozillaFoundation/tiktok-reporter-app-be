import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';

export class TestApp {
  private static instance: TestApp;
  private app: INestApplication;
  private constructor() {}

  public static getInstance(): TestApp {
    if (!TestApp.instance) {
      TestApp.instance = new TestApp();
    }

    return TestApp.instance;
  }

  public async getApp(): Promise<INestApplication> {
    if (this.app) {
      return this.app;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    return this.app;
  }
}
