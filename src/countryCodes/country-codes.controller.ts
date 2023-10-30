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
  UseGuards,
  Headers,
} from '@nestjs/common';

import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { UpdateCountryCodeDto } from './dtos/update-country-code.dto';
import { CountryCodeDto } from './dtos/country-code.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';

@UseInterceptors(SentryInterceptor)
@ApiTags('Country Codes')
@Controller('country-codes')
export class CountryCodesController {
  constructor(private readonly countryCodesService: CountryCodesService) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: CreateCountryCodeDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    status: 201,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(
    @Headers() headers,
    @Body() createCountryCodeDto: CreateCountryCodeDto,
  ) {
    return this.countryCodesService.create(
      headers[API_KEY_HEADER_VALUE] as string,
      createCountryCodeDto,
    );
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
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: UpdateCountryCodeDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    status: 201,
    type: CountryCodeDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Headers() headers,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryCodeDto: UpdateCountryCodeDto,
  ) {
    return this.countryCodesService.update(
      headers[API_KEY_HEADER_VALUE] as string,
      id,
      updateCountryCodeDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('api-key'))
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
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
