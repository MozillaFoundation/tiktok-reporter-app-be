import { CountryCodesModule } from 'src/countryCodes/country-codes.module';
import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Study]), CountryCodesModule],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
