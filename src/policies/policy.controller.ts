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
import { PoliciesService } from './policy.service';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @ApiBody({ type: CreatePolicyDto })
  @Post()
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.create(createPolicyDto);
  }

  @Get()
  findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.findOne(id);
  }
  @ApiBody({ type: UpdatePolicyDto })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    return this.policiesService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.remove(id);
  }
}
