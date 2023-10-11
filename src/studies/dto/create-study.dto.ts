import { IsString } from 'class-validator';

export class CreateStudyDto {
  @IsString()
  name: string;
}
