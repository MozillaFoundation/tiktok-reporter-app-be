import { CreateCountryCodeDto } from './create-country-code.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCountryCodeDto extends PartialType(CreateCountryCodeDto) {}
