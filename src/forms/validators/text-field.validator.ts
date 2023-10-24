import { isBoolean, isNumber, isString } from 'class-validator';

import { TextFieldDto } from '../dtos/text-field.dto';
import { ValidationResult } from '../types/validation-result';

export function validateTextField(
  textFieldDto: TextFieldDto,
): ValidationResult {
  let isValid = true;
  const messages: Array<string> = [];
  if (!isString(textFieldDto.placeholder)) {
    isValid = false;
    messages.push('PlaceHolder must be a valid string');
  }

  if (!isBoolean(textFieldDto.multiline)) {
    isValid = false;
    messages.push('Multiline must be a valid boolean');
  }

  if (!isNumber(textFieldDto.maxLines)) {
    isValid = false;
    messages.push('MaxLines must be a valid number');
  }

  return { isValid, messages };
}
