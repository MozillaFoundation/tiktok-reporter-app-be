import { IsBoolean, IsEnum, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from 'src/forms/types/fields/field.type';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class FieldDto {
  @ApiProperty({
    description: 'The id of the field',
    type: UUID,
  })
  @IsUUID()
  id: string;

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
    description: 'The Description of the Field',
    type: String,
  })
  @IsString()
  description;

  @ApiProperty({
    description: 'The Required state of the Field',
    type: Boolean,
  })
  @IsBoolean()
  isRequired;
}
