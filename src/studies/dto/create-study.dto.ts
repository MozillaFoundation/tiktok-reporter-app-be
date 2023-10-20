import { IsArray, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateStudyDto {
  @ApiProperty({
    description: 'The name of the study',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the study',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The ids of the country code associated to this study',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  countryCodeIds: string[];

  @ApiProperty({
    description: 'The ids of the policies associated to this study',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  policyIds: string[];

  @ApiProperty({
    description: 'The id of the onboarding associated to this study',
    type: String,
  })
  @IsUUID()
  onboardingId: string;
}
