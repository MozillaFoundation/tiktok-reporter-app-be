import { IsArray, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { StudyDto } from 'src/studies/dto/study.dto';

export class CountryCodeDto {
  @ApiProperty({
    description: 'The id of the country code',
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The Country Code',
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The Country Name',
    type: String,
  })
  @IsString()
  countryName: string;

  @ApiProperty({
    description: 'The studies for this policy',
    type: StudyDto,
  })
  @IsArray()
  studies: StudyDto[];
}
