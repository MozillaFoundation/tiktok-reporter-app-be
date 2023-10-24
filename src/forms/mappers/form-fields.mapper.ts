import { DropDownFieldDto } from '../dtos/drop-down-field.dto';
import { Field } from '../types/fields/field';
import { FieldDto } from '../dtos/field.dto';
import { FieldType } from '../types/fields/field.type';
import { SliderFieldDto } from '../dtos/slider-field.dto';
import { TextFieldDto } from '../dtos/text-field.dto';
import { mapDropDownField } from './drop-down-field.mapper';
import { mapSliderField } from './slider.field.mapper';
import { mapTextField } from './text-field.mapper';

export function mapFormFields(fieldDtos: Array<FieldDto>): Array<Field> {
  const mappedFields = [];

  for (const fieldDto of fieldDtos) {
    if (fieldDto.type === FieldType.TextField) {
      mappedFields.push(mapTextField(fieldDto as TextFieldDto));
    }
    if (fieldDto.type === FieldType.DropDown) {
      mappedFields.push(mapDropDownField(fieldDto as DropDownFieldDto));
    }
    if (fieldDto.type === FieldType.Slider) {
      mappedFields.push(mapSliderField(fieldDto as SliderFieldDto));
    }
  }

  return mappedFields;
}
