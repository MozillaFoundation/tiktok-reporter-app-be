import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './field.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class FormDto {
  @ApiProperty({
    description: 'The id of the form',
    type: UUID,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The Name of the form',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The fields for this form',
    type: [FieldDto],
  })
  @IsArray()
  fields: FieldDto[];

  @ApiProperty({
    description: 'The creation date of this form',
    type: Date,
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of this form',
    type: Date,
  })
  @IsDate()
  updatedAt: Date;
}
