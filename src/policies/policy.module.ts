import { Module } from '@nestjs/common';
import { PoliciesController } from './policy.controller';
import { PoliciesService } from './policy.service';
import { Policy } from './entities/policy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Policy])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
