import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { FormDto } from './dtos/form.dto';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dtos/create-form.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';

@Controller('forms')
@ApiTags('Forms')
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
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
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
