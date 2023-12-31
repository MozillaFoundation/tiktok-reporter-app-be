import { IsArray, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { OnboardingStepDto } from 'src/onboardingSteps/dtos/onboarding-step.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { FormDto } from 'src/forms/dtos/form.dto';

export class OnboardingDto {
  @ApiProperty({
    description: 'The id of the onboarding',
    type: UUID,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The Onboarding Name',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The onboarding steps for this onboarding',
    type: [OnboardingStepDto],
  })
  @IsArray()
  steps: OnboardingStepDto[];

  @ApiProperty({
    description: 'The form for this onboarding',
    type: FormDto,
  })
  form: FormDto;
}
