import { ApiProperty } from '@nestjs/swagger';

export class StorageFileDto {
  @ApiProperty({
    description: 'The File Id',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The File Name',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The Bucket Name',
    type: String,
  })
  bucketName: string;

  @ApiProperty({
    description: 'The Storage Url',
    type: String,
  })
  storageUrl;
}
