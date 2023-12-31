import { Injectable, Logger } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isBoolean,
  isString,
} from 'class-validator';

import { DropDownFieldDto } from '../dtos/drop-down-field.dto';
import { FieldDto } from 'src/forms/dtos/field.dto';
import { FieldType } from 'src/forms/types/fields/field.type';
import { SliderFieldDto } from '../dtos/slider-field.dto';
import { TextFieldDto } from 'src/forms/dtos/text-field.dto';
import { ValidationResult } from '../types/validation-result';
import { isFilledArray } from 'src/utils/isFilledArray';
import { validateDropDownField } from './drop-down-field.validator';
import { validateSliderField } from './slider-field.validator';
import { validateTextField } from './text-field.validator';

@ValidatorConstraint({ name: 'FormField' })
@Injectable()
export class FormFieldValidator implements ValidatorConstraintInterface {
  private messages: Array<string>;
  private readonly logger = new Logger(FormFieldValidator.name);

  validate(fieldDtos: Array<FieldDto>): boolean {
    try {
      this.messages = [];
      let isValid = true;

      if (!isFilledArray(fieldDtos)) {
        this.messages.push('The fields property cannot be empty');
        return false;
      }

      for (const fieldDto of fieldDtos) {
        if (!isBoolean(fieldDto.isRequired)) {
          isValid = false;
          this.messages.push('Is Required must be a valid boolean');
        }

        if (!isString(fieldDto.label)) {
          isValid = false;
          this.messages.push('Label must be a valid string');
        }

        if (!isString(fieldDto.description)) {
          isValid = false;
          this.messages.push('Description must be a valid string');
        }

        const validationResult = this.validateField(fieldDto);
        this.messages = this.messages.concat(validationResult.messages);
        isValid = isValid && validationResult.isValid;
      }

      return isValid;
    } catch (e) {
      this.messages.push('Something went wrong while validating the fields');
      this.logger.error('Something went wrong while validating the fields', e);
      return false;
    }
  }

  validateField(fieldDto: FieldDto): ValidationResult {
    switch (fieldDto.type) {
      case FieldType.TextField: {
        return validateTextField(fieldDto as TextFieldDto);
      }
      case FieldType.DropDown: {
        return validateDropDownField(fieldDto as DropDownFieldDto);
      }
      case FieldType.Slider: {
        return validateSliderField(fieldDto as SliderFieldDto);
      }
      default: {
        return {
          isValid: false,
          messages: ['One of the fields does not have the correct type'],
        };
      }
    }
  }

  defaultMessage(): string {
    return this.messages.join(';');
  }
}
