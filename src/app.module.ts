import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

// TEST Cloud Build 7
@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //     envFilePath: `.env.${process.env.NODE_ENV}`,
  //   }),
  //   DataBaseModule,
  //   StudiesModule,
  // ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true,
    //   }),
    // },
  ],
})
export class AppModule {}
