import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordingDto {
  @ApiProperty({
    description: 'The Recording file as mp4',
    type: String,
  })
  file: string;
}
