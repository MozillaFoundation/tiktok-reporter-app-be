import { IsArray, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CountryCodeDto } from 'src/countryCodes/dtos/country-code.dto';
import { OnboardingDto } from 'src/onboardings/dtos/onboarding.dto';
import { PolicyDto } from 'src/policies/dtos/policy.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class StudyDto {
  @ApiProperty({
    description: 'The id of the study',
    type: UUID,
  })
  @IsUUID()
  id: string;

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
    description: 'The country Codes for this study',
    type: [CountryCodeDto],
  })
  @IsArray()
  countryCodes: CountryCodeDto[];

  @ApiProperty({
    description: 'The policies for this study',
    type: [PolicyDto],
  })
  @IsArray()
  policies: PolicyDto[];

  @ApiProperty({
    description: 'The onboardings for this study',
    type: OnboardingDto,
  })
  onboardings: OnboardingDto;
}