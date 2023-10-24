import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OptionDto {
  @ApiProperty({
    description: 'The Title of the Option',
    type: String,
  })
  @IsString()
  title: string;
}
