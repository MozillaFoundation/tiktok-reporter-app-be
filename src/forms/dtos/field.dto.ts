import { IsBoolean, IsEnum, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from 'src/forms/types/fields/field.type';

export class FieldDto {
  @ApiProperty({
    description: 'The Field Type',
    enum: FieldType,
  })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({
    description: 'The Label of the Field',
    type: String,
  })
  @IsString()
  label;

  @ApiProperty({
    description: 'The Required state of the Field',
    type: Boolean,
  })
  @IsBoolean()
  isRequired;
}
