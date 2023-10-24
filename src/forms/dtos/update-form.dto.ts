import { CreateFormDto } from './create-form.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateFormDto extends PartialType(CreateFormDto) {}
