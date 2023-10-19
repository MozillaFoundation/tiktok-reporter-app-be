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
import { OnboardingsService } from './onboardings.service';
import { CreateOnboardingDto } from './dtos/create-onboarding.dto';
import { UpdateOnboardingDto } from './dtos/update-onboarding.dto';

@Controller('onboardings')
export class OnboardingsController {
  constructor(private readonly onboardingsService: OnboardingsService) {}

  @ApiBody({ type: CreateOnboardingDto })
  @Post()
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingsService.create(createOnboardingDto);
  }

  @Get()
  findAll() {
    return this.onboardingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ) {
    return this.onboardingsService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.onboardingsService.remove(id);
  }
}
