import { CountryCode } from './entities/country-code.entity';
import { CountryCodesController } from './country-codes.controller';
import { CountryCodesService } from './country-codes.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCode, ApiKey])],
  controllers: [CountryCodesController],
  providers: [CountryCodesService],
  exports: [CountryCodesService],
})
export class CountryCodesModule {}
