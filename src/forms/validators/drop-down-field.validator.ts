import { isBoolean, isEmpty, isString } from 'class-validator';

import { DropDownFieldDto } from '../dtos/drop-down-field.dto';
import { ValidationResult } from '../types/validation-result';

export function validateDropDownField(
  dropDownFieldDto: DropDownFieldDto,
): ValidationResult {
  let isValid = true;
  const messages: Array<string> = [];
  if (!isString(dropDownFieldDto.placeholder)) {
    isValid = false;
    messages.push('PlaceHolder must be a valid string');
  }

  if (isEmpty(dropDownFieldDto.options)) {
    isValid = false;
    messages.push('Options cannot be empty');
  }

  if (!isString(dropDownFieldDto.selected)) {
    isValid = false;
    messages.push('Selected must be a valid string value');
  }

  if (!isBoolean(dropDownFieldDto.hasOtherOption)) {
    isValid = false;
    messages.push('Has Other Option must be a valid boolean value');
  }

  return { isValid, messages };
}
