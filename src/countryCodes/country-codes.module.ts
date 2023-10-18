import { CountryCode } from './entities/country-code.entity';
import { CountryCodesController } from './country-codes.controller';
import { CountryCodesService } from './country-codes.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCode])],
  controllers: [CountryCodesController],
  providers: [CountryCodesService],
  exports: [CountryCodesService],
})
export class CountryCodesModule {}
