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
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { StudyDto } from './dto/study.dto';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';
import { RealIP } from 'nestjs-real-ip';
import { RequestContext } from 'src/decorators/request-context';
import { RequestContextInterceptor } from 'src/interceptors/request-context.interceptor';

@UseInterceptors(SentryInterceptor, RequestContextInterceptor)
@ApiTags('Studies')
@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: CreateStudyDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    status: 201,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Headers() headers, @Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.create(
      headers[API_KEY_HEADER_VALUE] as string,
      createStudyDto,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [StudyDto],
  })
  findAll() {
    return this.studiesService.findAll();
  }

  @Get('by-country-code')
  @ApiResponse({
    status: 200,
    type: [StudyDto],
  })
  findByIpAddress(@RealIP() ipAddress: string) {
    return this.studiesService.findByIpAddress(ipAddress);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(
    @RequestContext() requestContext,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.studiesService.findOne(id, requestContext.platform);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: UpdateStudyDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    status: 201,
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Headers() headers,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudyDto: UpdateStudyDto,
  ) {
    return this.studiesService.update(
      headers[API_KEY_HEADER_VALUE] as string,
      id,
      updateStudyDto,
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
    type: StudyDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studiesService.remove(id);
  }
}
