import { FieldType } from '../types/fields/field.type';
import { TextField } from '../types/fields/text.field';
import { TextFieldDto } from '../dtos/text-field.dto';
import { randomUuidv4 } from 'src/utils/generate-uuid';

export function mapTextField(textFieldDto: TextFieldDto): TextField {
  return {
    id: randomUuidv4(),
    type: FieldType.TextField,
    label: textFieldDto.label,
    isRequired: textFieldDto.isRequired || false,
    placeholder: textFieldDto.placeholder,
    multiline: textFieldDto.multiline || false,
    maxLines: textFieldDto.maxLines || 0,
  };
}
