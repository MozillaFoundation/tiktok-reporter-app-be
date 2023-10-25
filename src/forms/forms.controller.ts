import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';

import { FormDto } from './dtos/form.dto';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dtos/create-form.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';

@UseInterceptors(SentryInterceptor)
@ApiTags('Forms')
@UseGuards(AuthGuard('api-key'))
@Controller('forms')
@ApiHeader({
  name: 'X-API-KEY',
  description: 'Mandatory API Key to use the regrets reporter API',
  required: true,
})
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({
    type: FormDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Headers() headers, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(
      headers[API_KEY_HEADER_VALUE] as string,
      createFormDto,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: FormDto,
  })
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: FormDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: FormDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.remove(id);
  }
}
