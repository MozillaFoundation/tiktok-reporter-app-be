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
import { OnboardingStepsService } from './onboarding-steps.service';
import { CreateOnboardingStepDto } from './dtos/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dtos/update-onboarding-step.dto';
import { OnboardingStepDto } from './dtos/onboarding-step.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('onboarding-steps')
@ApiTags('Onboarding Steps')
export class OnboardingStepsController {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
  ) {}

  @Post()
  @ApiBody({ type: CreateOnboardingStepDto })
  @ApiResponse({
    type: OnboardingStepDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Body() createOnboardingStepDto: CreateOnboardingStepDto) {
    return this.onboardingStepsService.create(createOnboardingStepDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [OnboardingStepDto],
  })
  findAll() {
    return this.onboardingStepsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: OnboardingStepDto,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingStepsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateOnboardingStepDto })
  @ApiResponse({
    type: OnboardingStepDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) {
    return this.onboardingStepsService.update(id, updateOnboardingStepDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: OnboardingStepDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingStepsService.remove(id);
  }
}
