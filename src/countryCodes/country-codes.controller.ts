import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ApiBody } from '@nestjs/swagger';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dtos/create-country-code.dto';
import { UpdateCountryCodeDto } from './dtos/update-country-code.dto';

@Controller('country-codes')
export class CountryCodesController {
  constructor(private readonly countryCodesService: CountryCodesService) {}

  @ApiBody({ type: CreateCountryCodeDto })
  @Post()
  create(@Body() createCountryCodeDto: CreateCountryCodeDto) {
    return this.countryCodesService.create(createCountryCodeDto);
  }

  @Get()
  findAll() {
    return this.countryCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryCodesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryCodeDto: UpdateCountryCodeDto,
  ) {
    return this.countryCodesService.update(id, updateCountryCodeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryCodesService.remove(id);
  }
}
