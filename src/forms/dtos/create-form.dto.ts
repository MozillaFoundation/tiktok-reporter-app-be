import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { AreFieldsValid } from 'src/forms/decorators/areFieldsValid';
import { FieldDto } from './field.dto';

export class CreateFormDto {
  @ApiProperty({
    description: 'The Form Name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The fields that are part of the form',
    type: [FieldDto],
  })
  @IsArray()
  @AreFieldsValid()
  fields: FieldDto[];
}
