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
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { StudyDto } from './dto/study.dto';

@Controller('studies')
@ApiTags('Studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post()
  @ApiBody({ type: CreateStudyDto })
  @ApiResponse({
    status: 201,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.create(createStudyDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [StudyDto],
  })
  findAll() {
    return this.studiesService.findAll();
  }

  @Get('country-codes/:countryCode')
  @ApiResponse({
    status: 200,
    type: [StudyDto],
  })
  findByCountryCode(@Param('countryCode') countryCode: string) {
    return this.studiesService.findByCountryCode(countryCode);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateStudyDto })
  @ApiResponse({
    status: 201,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ) {
    return this.studiesService.update(id, updateStudyDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studiesService.remove(id);
  }
}
