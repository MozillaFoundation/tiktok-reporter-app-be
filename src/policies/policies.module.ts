import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { Policy } from './entities/policy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, ApiKey])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
