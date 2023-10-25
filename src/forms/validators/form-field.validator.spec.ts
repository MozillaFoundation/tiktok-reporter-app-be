import { defaultCreateFormDto } from 'src/utils/constants';
import { TextFieldDto } from '../dtos/text-field.dto';
import { FieldType } from '../types/fields/field.type';
import { FormFieldValidator } from './form-field.validator';

describe('Form Field Validator', () => {
  it('should return isValid true and no message when the form fields are valid', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate(defaultCreateFormDto.fields);

    expect(isValid).toEqual(true);
    expect(formFieldValidator.defaultMessage()).toEqual('');
  });

  it('should return isValid false and correct message when fields are empty', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate([]);

    expect(isValid).toEqual(false);
    expect(formFieldValidator.defaultMessage()).toEqual(
      'The fields property cannot be empty',
    );
  });

  it('should return isValid false and correct message when isRequired is not a valid boolean', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate([
      {
        type: FieldType.TextField,
        label: 'Text Field Label',
        description: 'Text Field description',
        placeholder: 'Text Field Placeholder',
        isRequired: 'Not a valid boolean',
        multiline: true,
        maxLines: 2,
      } as TextFieldDto,
    ]);

    expect(isValid).toEqual(false);
    expect(formFieldValidator.defaultMessage()).toEqual(
      'Is Required must be a valid boolean',
    );
  });

  it('should return isValid false and correct message when label is not a valid string', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate([
      {
        type: FieldType.TextField,
        label: true,
        description: 'Text Field description',
        placeholder: 'Text Field Placeholder',
        isRequired: true,
        multiline: true,
        maxLines: 2,
      } as TextFieldDto,
    ]);

    expect(isValid).toEqual(false);
    expect(formFieldValidator.defaultMessage()).toEqual(
      'Label must be a valid string',
    );
  });

  it('should return isValid false and correct message when description is not a valid string', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate([
      {
        type: FieldType.TextField,
        label: 'Text Field Label',
        description: true,
        placeholder: 'Text Field Placeholder',
        isRequired: true,
        multiline: true,
        maxLines: 2,
      } as TextFieldDto,
    ]);

    expect(isValid).toEqual(false);
    expect(formFieldValidator.defaultMessage()).toEqual(
      'Description must be a valid string',
    );
  });

  it('should return isValid false and correct message when field type is not valid', () => {
    const formFieldValidator = new FormFieldValidator();
    const isValid = formFieldValidator.validate([
      {
        type: 'Invalid Field Type',
        label: 'Text Field Label',
        description: 'Text Field Description',
        placeholder: 'Text Field Placeholder',
        isRequired: true,
        multiline: true,
        maxLines: 2,
      } as any,
    ]);

    expect(isValid).toEqual(false);
    expect(formFieldValidator.defaultMessage()).toEqual(
      'One of the fields does not have the correct type',
    );
  });
});
