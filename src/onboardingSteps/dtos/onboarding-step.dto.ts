import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { OnboardingDto } from 'src/onboardings/dtos/onboarding.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class OnboardingStepDto {
  @ApiProperty({
    description: 'The id of the onboarding step',
    type: UUID,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The OnboardingStep Title',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The OnboardingStep Description',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The OnboardingStep Image Url',
    type: String,
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: 'The OnboardingStep Details',
    type: String,
  })
  @IsString()
  details: string;

  @ApiProperty({
    description: 'The OnboardingStep Order',
    type: Number,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'The onboardings for this onboarding step',
    type: OnboardingDto,
  })
  @IsArray()
  onboardings: OnboardingDto[];
}
