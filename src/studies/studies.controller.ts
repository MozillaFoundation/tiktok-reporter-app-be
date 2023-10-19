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
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @ApiBody({ type: CreateStudyDto })
  @Post()
  create(@Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.create(createStudyDto);
  }

  @Get()
  findAll() {
    return this.studiesService.findAll();
  }

  @Get('country-codes/:countryCode')
  findByCountryCode(@Param('countryCode') countryCode: string) {
    return this.studiesService.findByCountryCode(countryCode);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ) {
    return this.studiesService.update(id, updateStudyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studiesService.remove(id);
  }
}
