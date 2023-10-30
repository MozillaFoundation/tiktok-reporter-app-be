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
import { OnboardingStepsService } from './onboarding-steps.service';
import { CreateOnboardingStepDto } from './dtos/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dtos/update-onboarding-step.dto';
import { OnboardingStepDto } from './dtos/onboarding-step.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';

@UseInterceptors(SentryInterceptor)
@ApiTags('Onboarding Steps')
@Controller('onboarding-steps')
export class OnboardingStepsController {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: CreateOnboardingStepDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    type: OnboardingStepDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(
    @Headers() headers,
    @Body() createOnboardingStepDto: CreateOnboardingStepDto,
  ) {
    return this.onboardingStepsService.create(
      headers[API_KEY_HEADER_VALUE] as string,
      createOnboardingStepDto,
    );
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
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: UpdateOnboardingStepDto })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'Mandatory API Key to use the regrets reporter API',
    required: true,
  })
  @ApiResponse({
    type: OnboardingStepDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Headers() headers,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) {
    return this.onboardingStepsService.update(
      headers[API_KEY_HEADER_VALUE] as string,
      id,
      updateOnboardingStepDto,
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
    type: OnboardingStepDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingStepsService.remove(id);
  }
}
