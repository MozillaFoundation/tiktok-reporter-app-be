import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PolicyType } from '../entities/policy.entity';
import { StudyDto } from 'src/studies/dto/study.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class PolicyDto {
  @ApiProperty({
    description: 'The id of the policy',
    type: UUID,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The Policy Type',
    enum: PolicyType,
  })
  @IsEnum(PolicyType)
  type: PolicyType;

  @ApiProperty({
    description: 'The Policy Title',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The Policy Subtitle',
    type: String,
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    description: 'The Policy Text',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The studies for this policy',
    type: StudyDto,
  })
  @IsArray()
  studies: StudyDto[];
}
