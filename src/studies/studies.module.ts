import { CountryCodesModule } from 'src/countryCodes/country-codes.module';
import { Module } from '@nestjs/common';
import { PoliciesModule } from 'src/policies/policies.module';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Study } from './entities/study.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingsModule } from 'src/onboardings/onboardings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Study]),
    CountryCodesModule,
    PoliciesModule,
    OnboardingsModule,
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
