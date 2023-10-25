import { DropDownFieldDto } from '../dtos/drop-down-field.dto';
import { FieldType } from '../types/fields/field.type';
import { validateDropDownField } from './drop-down-field.validator';

describe('Drop Down Validator', () => {
  it('should return isValid true and no message when dropdown is valid', () => {
    const { isValid, messages } = validateDropDownField({
      type: FieldType.DropDown,
      label: 'Drop Down Field Label',
      description: 'Drop Down Field description',
      placeholder: 'Drop Down Field Placeholder',
      isRequired: true,
      options: [
        {
          title: 'First Option',
        },
        {
          title: 'Second Option',
        },
      ],
      selected: 'First Option',
      hasOtherOption: true,
    } as DropDownFieldDto);

    expect(isValid).toEqual(true);
    expect(messages.length).toEqual(0);
  });

  it('should return isValid false and correct message when placeholder is not a valid string', () => {
    const { isValid, messages } = validateDropDownField({
      type: FieldType.DropDown,
      label: 'Drop Down Field Label',
      description: 'Drop Down Field description',
      placeholder: 23,
      isRequired: true,
      options: [
        {
          title: 'First Option',
        },
        {
          title: 'Second Option',
        },
      ],
      selected: 'First Option',
      hasOtherOption: true,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['PlaceHolder must be a valid string']);
  });

  it('should return isValid false and correct message when options is empty', () => {
    const { isValid, messages } = validateDropDownField({
      type: FieldType.DropDown,
      label: 'Drop Down Field Label',
      description: 'Drop Down Field description',
      placeholder: 'Drop Down Field Placeholder',
      isRequired: true,
      options: [],
      selected: 'First Option',
      hasOtherOption: true,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Options cannot be empty']);
  });

  it('should return isValid false and correct message when selected is not a valid string', () => {
    const { isValid, messages } = validateDropDownField({
      type: FieldType.DropDown,
      label: 'Drop Down Field Label',
      description: 'Drop Down Field description',
      placeholder: 'Drop Down Field Placeholder',
      isRequired: true,
      options: [
        {
          title: 'First Option',
        },
        {
          title: 'Second Option',
        },
      ],
      selected: true,
      hasOtherOption: true,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Selected must be a valid string']);
  });

  it('should return isValid false and correct message when hasOtherOption is not a valid boolean', () => {
    const { isValid, messages } = validateDropDownField({
      type: FieldType.DropDown,
      label: 'Drop Down Field Label',
      description: 'Drop Down Field description',
      placeholder: 'Drop Down Field Placeholder',
      isRequired: true,
      options: [
        {
          title: 'First Option',
        },
        {
          title: 'Second Option',
        },
      ],
      selected: 'First Option',
      hasOtherOption: 'Not a valid boolean',
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Has Other Option must be a valid boolean']);
  });
});
