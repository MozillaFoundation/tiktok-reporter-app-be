import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './field.dto';

export class SliderFieldDto extends FieldDto {
  @ApiProperty({
    description: 'The maximum value of the slider',
    type: Number,
  })
  @IsNumber()
  max: number;

  @ApiProperty({
    description: 'The Left label of the slider',
    type: String,
  })
  @IsString()
  leftLabel;

  @ApiProperty({
    description: 'The Right label of the slider',
    type: String,
  })
  @IsString()
  rightLabel;

  @ApiProperty({
    description: 'The step value of the slider',
    type: Number,
  })
  @IsNumber()
  step: number;
}
