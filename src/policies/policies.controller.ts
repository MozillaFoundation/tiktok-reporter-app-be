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

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crates a new policy',
  })
  @ApiResponse({
    type: CreatePolicyDto,
    status: 201,
  })
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.create(createPolicyDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all policies',
  })
  findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns a policy based on id',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.findOne(id);
  }
  @Patch(':id')
  @ApiBody({
    type: UpdatePolicyDto,
    description: 'Updates a policy',
  })
  @ApiResponse({
    type: UpdatePolicyDto,
    status: 200,
  })
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
