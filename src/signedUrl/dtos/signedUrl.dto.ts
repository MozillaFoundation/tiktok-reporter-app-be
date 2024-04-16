import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignedUrlDto {
  @ApiProperty({
    description: 'The signed url',
    type: String,
  })
  @IsString()
  url: string;
}
