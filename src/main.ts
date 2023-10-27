import 'dotenv/config';

import * as Sentry from '@sentry/node';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whitelist set to true strips the request of other values that are not part of the original DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Regrets Reporter')
    .setDescription('The Regrets Reporter API description')
    .setVersion('1.0')
    .addTag('regretsReporter')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  Sentry.init({
    dsn: process.env.SENTRY_DSN_URL || 'SENTRY_DSN_URL',
  });

  await app.listen(port);
}
bootstrap();
