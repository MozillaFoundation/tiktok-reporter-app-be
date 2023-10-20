import {
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';

import { ErrorDTO } from 'src/common/dtos/error.dto';

export function ApiErrorDecorator(
  statusCode: HttpStatus,
  message: string,
  description?: string,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiResponse({
      ...options,
      status: statusCode,
      description: description,
      schema: {
        default: {
          message: [message],
          statusCode,
          error: message,
        },
        type: getSchemaPath(ErrorDTO),
      },
    }),
  );
}
