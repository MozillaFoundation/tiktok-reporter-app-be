import { CreateStudyDto } from './create-study.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateStudyDto extends PartialType(CreateStudyDto) {}
