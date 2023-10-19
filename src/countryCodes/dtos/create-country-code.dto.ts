import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCountryCodeDto {
  @ApiProperty({
    description: 'The Country Code',
    type: String,
  })
  @IsString()
  countryCode: string;

  @ApiProperty({
    description: 'The Country Name',
    type: String,
  })
  @IsString()
  countryName: string;
}
