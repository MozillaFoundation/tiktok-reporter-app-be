import 'dotenv/config';

import * as Sentry from '@sentry/node';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SentryFilter } from './filters/SentryFilter';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
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
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  app.use(bodyParser.urlencoded({ limit: '2gb', extended: true }));
  app.use(bodyParser.json({ limit: '2gb' }));

  await app.listen(port);
}
bootstrap();
