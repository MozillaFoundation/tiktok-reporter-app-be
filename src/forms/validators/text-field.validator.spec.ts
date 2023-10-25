import { TextFieldDto } from '../dtos/text-field.dto';
import { FieldType } from '../types/fields/field.type';
import { validateTextField } from './text-field.validator';

describe('Text Field Validator', () => {
  it('should return isValid true and no message when text field is valid', () => {
    const { isValid, messages } = validateTextField({
      type: FieldType.TextField,
      label: 'Text Field Label',
      description: 'Text Field description',
      placeholder: 'Text Field Placeholder',
      isRequired: true,
      multiline: true,
      maxLines: 2,
    } as TextFieldDto);

    expect(isValid).toEqual(true);
    expect(messages.length).toEqual(0);
  });

  it('should return isValid false and correct message when placeholder is not a valid string', () => {
    const { isValid, messages } = validateTextField({
      type: FieldType.TextField,
      label: 'Text Field Label',
      description: 'Text Field description',
      placeholder: true,
      isRequired: true,
      multiline: true,
      maxLines: 2,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['PlaceHolder must be a valid string']);
  });

  it('should return isValid false and correct message when multiline is not a valid boolean', () => {
    const { isValid, messages } = validateTextField({
      type: FieldType.TextField,
      label: 'Text Field Label',
      description: 'Text Field description',
      placeholder: 'Text Field Placeholder',
      isRequired: true,
      multiline: 'Not a valid boolean',
      maxLines: 2,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Multiline must be a valid boolean']);
  });

  it('should return isValid false and correct message when maxLines is not a valid number', () => {
    const { isValid, messages } = validateTextField({
      type: FieldType.TextField,
      label: 'Text Field Label',
      description: 'Text Field description',
      placeholder: 'Text Field Placeholder',
      isRequired: true,
      multiline: true,
      maxLines: 'Not a valid number',
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['MaxLines must be a valid number']);
  });
});
