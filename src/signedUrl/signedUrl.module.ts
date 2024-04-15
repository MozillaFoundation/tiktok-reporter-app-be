import { Module } from '@nestjs/common';
import { SignedUIrlController } from './signedUIrl.controller';
import { SignedUrlService } from './signedUrl.service';

@Module({
  controllers: [SignedUIrlController],
  providers: [SignedUrlService],
  exports: [SignedUrlService],
})
export class SignedUrlModule {}
