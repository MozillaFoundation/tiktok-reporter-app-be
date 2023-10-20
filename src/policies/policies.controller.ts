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

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PolicyDto } from './dtos/policy.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';

@Controller('policies')
@ApiTags('Policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crates a new policy',
  })
  @ApiResponse({
    type: PolicyDto,
    status: 201,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.create(createPolicyDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [PolicyDto],
  })
  findAll() {
    return this.policiesService.findAll();
  }

  @Get('app')
  @ApiResponse({
    status: 200,
    type: [PolicyDto],
  })
  findAppPolicies() {
    return this.policiesService.findAppPolicies();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: PolicyDto,
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
    type: PolicyDto,
    status: 200,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    return this.policiesService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: PolicyDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.remove(id);
  }
}
