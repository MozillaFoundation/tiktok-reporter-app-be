import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageFileDto } from './dtos/storage-file.dto';
import { CreateRecordingDto } from './dtos/create-recording.dto';
import { getMaxFileSize } from 'src/utils/file.utils';
import { Throttle } from '@nestjs/throttler';
import { getThrottlerLimit, getThrottlerTtl } from 'src/utils/throttler.utils';

@UseInterceptors(SentryInterceptor)
@Throttle({
  default: {
    ttl: getThrottlerTtl(),
    limit: getThrottlerLimit(),
  },
})
@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @ApiBody({
    type: CreateRecordingDto,
    description: 'Save a a recording',
  })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    type: StorageFileDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.PAYLOAD_TOO_LARGE, 'Payload to Large')
  @ApiErrorDecorator(
    HttpStatus.UNPROCESSABLE_ENTITY,
    'Payload cannot be processed',
  )
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  async uploadRecording(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'mp4',
        })
        .addMaxSizeValidator({
          maxSize: getMaxFileSize(),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(`uploadRecording`);
    return await this.storageService.save(file);
  }
}
