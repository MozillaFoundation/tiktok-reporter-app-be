import { IsEnum, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PolicyType } from 'src/types/policy.type';

export class CreatePolicyDto {
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
}
