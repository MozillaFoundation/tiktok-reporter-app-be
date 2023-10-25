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
import { OnboardingsService } from './onboardings.service';
import { CreateOnboardingDto } from './dtos/create-onboarding.dto';
import { UpdateOnboardingDto } from './dtos/update-onboarding.dto';
import { OnboardingDto } from './dtos/onboarding.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('onboardings')
@ApiTags('Onboardings')
export class OnboardingsController {
  constructor(private readonly onboardingsService: OnboardingsService) {}

  @Post()
  @ApiBody({ type: CreateOnboardingDto })
  @ApiResponse({
    type: OnboardingDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingsService.create(createOnboardingDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [OnboardingDto],
  })
  findAll() {
    return this.onboardingsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: OnboardingDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateOnboardingDto })
  @ApiResponse({
    type: OnboardingDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ) {
    return this.onboardingsService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: OnboardingDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingsService.remove(id);
  }
}
