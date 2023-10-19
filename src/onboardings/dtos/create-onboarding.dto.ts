import { IsArray, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOnboardingDto {
  @ApiProperty({
    description: 'The Onboarding Name',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ids of the onboarding steps associated to this study',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  stepIds: string[];
}
