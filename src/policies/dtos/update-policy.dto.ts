import { CreatePolicyDto } from './create-policy.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}
