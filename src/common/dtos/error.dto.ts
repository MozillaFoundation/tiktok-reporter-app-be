import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
export class ErrorDTO {
  @ApiProperty({ default: 'Internal Server Error' })
  message: string;
  @ApiProperty({ enum: HttpStatus, default: HttpStatus.INTERNAL_SERVER_ERROR })
  status_code: HttpStatus;
  @ApiProperty({ default: new Date().toISOString() })
  date: Date;
}
