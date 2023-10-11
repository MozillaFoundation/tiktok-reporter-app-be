import { CreateStudyDto } from './create-study.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateStudyDto extends PartialType(CreateStudyDto) {}
