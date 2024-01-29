import { DropDownField } from '../types/fields/drop-down.field';
import { DropDownFieldDto } from '../dtos/drop-down-field.dto';
import { FieldType } from '../types/fields/field.type';
import { isDefined } from 'class-validator';
import { mapOptions } from './options.mapper';
import { randomUuidv4 } from 'src/utils/generate-uuid';

export function mapDropDownField(
  dropDownFieldDto: DropDownFieldDto,
): DropDownField {
  const mappedOptions = mapOptions(dropDownFieldDto.options);
  const selectedOption = mappedOptions.find(
    (option) => option.title === dropDownFieldDto.selected,
  );

  return {
    id: randomUuidv4(),
    type: FieldType.DropDown,
    label: dropDownFieldDto.label,
    isTikTokLink: false,
    description: dropDownFieldDto.description,
    placeholder: dropDownFieldDto.placeholder,
    isRequired: dropDownFieldDto.isRequired || false,
    options: mappedOptions,
    selected: selectedOption.id || '',
    hasOtherOption: isDefined(dropDownFieldDto.hasOtherOption)
      ? dropDownFieldDto.hasOtherOption
      : false,
  };
}
