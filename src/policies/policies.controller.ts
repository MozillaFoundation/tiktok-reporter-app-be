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

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dtos/create-policy.dto';
import { UpdatePolicyDto } from './dtos/update-policy.dto';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PolicyDto } from './dtos/policy.dto';
import { ApiErrorDecorator } from 'src/common/decorator/error/error.decorator';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_HEADER_VALUE } from 'src/utils/constants';

@UseInterceptors(SentryInterceptor)
@ApiTags('Policies')
@UseGuards(AuthGuard('api-key'))
@Controller('policies')
@ApiHeader({
  name: 'X-API-KEY',
  description: 'Mandatory API Key to use the regrets reporter API',
  required: true,
})
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
  create(@Headers() headers, @Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.create(
      headers[API_KEY_HEADER_VALUE] as string,
      createPolicyDto,
    );
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
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
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
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  update(
    @Headers() headers,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    return this.policiesService.update(
      headers[API_KEY_HEADER_VALUE] as string,
      id,
      updatePolicyDto,
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: PolicyDto,
  })
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.policiesService.remove(id);
  }
}
