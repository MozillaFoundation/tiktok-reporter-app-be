import { isNumber, isString } from 'class-validator';

import { SliderFieldDto } from '../dtos/slider-field.dto';
import { ValidationResult } from '../types/validation-result';

export function validateSliderField(
  sliderField: SliderFieldDto,
): ValidationResult {
  let isValid = true;
  const messages: Array<string> = [];
  if (!isNumber(sliderField.max)) {
    isValid = false;
    messages.push('Max must be a valid number');
  }

  if (!isString(sliderField.leftLabel)) {
    isValid = false;
    messages.push('Left Label must be a valid string');
  }

  if (!isString(sliderField.rightLabel)) {
    isValid = false;
    messages.push('Right Label must be a valid string');
  }

  if (!isNumber(sliderField.step)) {
    isValid = false;
    messages.push('Step must be a valid number');
  }

  return { isValid, messages };
}
