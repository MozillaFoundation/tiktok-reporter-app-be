import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './field.dto';

export class TextFieldDto extends FieldDto {
  @ApiProperty({
    description: 'The Placeholder of the Field',
    type: String,
  })
  @IsString()
  placeholder: string;

  @ApiProperty({
    description: 'The Multiline state of the Field',
    type: Boolean,
  })
  @IsBoolean()
  multiline: boolean;

  @ApiProperty({
    description: 'Checking if the field is used for sharing a link',
    type: Boolean,
  })
  @IsBoolean()
  isTikTokLink;

  @ApiProperty({
    description: 'The number of lines of the multi line text field',
    type: Number,
  })
  @IsNumber()
  maxLines: number;
}
