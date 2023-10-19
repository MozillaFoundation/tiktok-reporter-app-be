import { CreateCountryCodeDto } from './create-country-code.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCountryCodeDto extends PartialType(CreateCountryCodeDto) {}
