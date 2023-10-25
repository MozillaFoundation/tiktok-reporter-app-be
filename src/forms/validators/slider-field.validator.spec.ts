import { SliderFieldDto } from '../dtos/slider-field.dto';
import { FieldType } from '../types/fields/field.type';
import { validateSliderField } from './slider-field.validator';

describe('Slider Field Validator', () => {
  it('should return isValid true and no message when text field is valid', () => {
    const { isValid, messages } = validateSliderField({
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 1000,
      leftLabel: 'Left Label',
      rightLabel: 'Right Label',
      step: 5,
    } as SliderFieldDto);

    expect(isValid).toEqual(true);
    expect(messages.length).toEqual(0);
  });
  it('should return isValid false and correct message when max is not a valid number', () => {
    const { isValid, messages } = validateSliderField({
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 'Not a valid number',
      leftLabel: 'Left Label',
      rightLabel: 'Right Label',
      step: 5,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Max must be a valid number']);
  });
  it('should return isValid false and correct message when leftLabel is not a valid string', () => {
    const { isValid, messages } = validateSliderField({
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 1000,
      leftLabel: true,
      rightLabel: 'Right Label',
      step: 5,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Left Label must be a valid string']);
  });

  it('should return isValid false and correct message when rightLabel is not a valid string', () => {
    const { isValid, messages } = validateSliderField({
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 1000,
      leftLabel: 'Left Label',
      rightLabel: true,
      step: 5,
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Right Label must be a valid string']);
  });

  it('should return isValid false and correct message when step is not a valid number', () => {
    const { isValid, messages } = validateSliderField({
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 1000,
      leftLabel: 'Left Label',
      rightLabel: 'Right Label',
      step: 'Not a valid number',
    } as any);

    expect(isValid).toEqual(false);
    expect(messages.length).toEqual(1);
    expect(messages).toEqual(['Step must be a valid number']);
  });
});
