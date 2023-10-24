import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './field.dto';
import { OptionDto } from './option.dto';

export class DropDownFieldDto extends FieldDto {
  @ApiProperty({
    description: 'The Placeholder of the Field',
    type: String,
  })
  @IsString()
  placeholder: string;

  @ApiProperty({
    description: 'The options for this drop down',
    type: [OptionDto],
  })
  @IsArray()
  options: OptionDto[];

  @ApiProperty({
    description: 'The id of the selected option',
    type: String,
  })
  @IsNumber()
  selected: string;

  @ApiProperty({
    description: 'Should display a None option',
    type: Boolean,
  })
  @IsBoolean()
  hasNoneOption;
}
