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
import { OnboardingStepsService } from './onboarding-steps.service';
import { CreateOnboardingStepDto } from './dtos/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dtos/update-onboarding-step.dto';

@Controller('onboarding-steps')
export class OnboardingStepsController {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
  ) {}

  @ApiBody({ type: CreateOnboardingStepDto })
  @Post()
  create(@Body() createOnboardingStepDto: CreateOnboardingStepDto) {
    return this.onboardingStepsService.create(createOnboardingStepDto);
  }

  @Get()
  findAll() {
    return this.onboardingStepsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingStepsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) {
    return this.onboardingStepsService.update(id, updateOnboardingStepDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingStepsService.remove(id);
  }
}
