import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
export function BadRequest(
  message: string,
  description?: string,
  options?: ApiResponseOptions,
) {
  return ApiErrorDecorator(
    HttpStatus.BAD_REQUEST,
    message,
    description,
    options,
  );
}
export function InternalError(
  message: string,
  description?: string,
  options?: ApiResponseOptions,
) {
  return ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    message,
    description,
    options,
  );
}
