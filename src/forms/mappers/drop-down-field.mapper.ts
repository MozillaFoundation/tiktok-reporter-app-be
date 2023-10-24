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

  console.log('mappedOptions', mappedOptions);
  console.log('selectedOption', selectedOption);
  return {
    id: randomUuidv4(),
    type: FieldType.DropDown,
    label: dropDownFieldDto.label,
    placeholder: dropDownFieldDto.placeholder,
    isRequired: dropDownFieldDto.isRequired || false,
    options: mappedOptions,
    selected: selectedOption.id || '',
    hasNoneOption: isDefined(dropDownFieldDto.hasNoneOption)
      ? dropDownFieldDto.hasNoneOption
      : false,
  };
}
