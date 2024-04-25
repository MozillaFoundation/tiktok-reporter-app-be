import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignedUrlController } from './signedUIrl.controller';
import { SignedUrlService } from './signedUrl.service';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  controllers: [SignedUrlController],
  providers: [SignedUrlService],
  exports: [SignedUrlService],
})
export class SignedUrlModule {}
