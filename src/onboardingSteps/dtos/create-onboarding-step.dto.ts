import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOnboardingStepDto {
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
    type: String,
  })
  @IsString()
  order: number;
}
