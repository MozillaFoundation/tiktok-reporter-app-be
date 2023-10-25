import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { UpdateCountryCodeDto } from './dtos/update-country-code.dto';
import { CountryCodeDto } from './dtos/country-code.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('country-codes')
@ApiTags('Country Codes')
export class CountryCodesController {
  constructor(private readonly countryCodesService: CountryCodesService) {}

  @Post()
  @ApiBody({ type: CreateCountryCodeDto })
  @ApiResponse({
    status: 201,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Body() createCountryCodeDto: CreateCountryCodeDto) {
    return this.countryCodesService.create(createCountryCodeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [CountryCodeDto],
  })
  findAll() {
    return this.countryCodesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryCodesService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCountryCodeDto })
  @ApiResponse({
    status: 201,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryCodeDto: UpdateCountryCodeDto,
  ) {
    return this.countryCodesService.update(id, updateCountryCodeDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryCodesService.remove(id);
  }
}
