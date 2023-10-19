import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PolicyType } from 'src/models/policyType';

export class CreatePolicyDto {
  @ApiProperty({ enum: PolicyType })
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
