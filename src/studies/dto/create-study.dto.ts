import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStudyDto {
  @ApiProperty({
    description: 'The name of the study',
    type: String,
  })
  @IsString()
  name: string;
}
