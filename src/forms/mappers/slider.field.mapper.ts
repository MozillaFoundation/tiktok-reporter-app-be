import { FieldType } from '../types/fields/field.type';
import { SliderField } from '../types/fields/slider.field';
import { SliderFieldDto } from '../dtos/slider-field.dto';
import { randomUuidv4 } from 'src/utils/generate-uuid';

export function mapSliderField(sliderFieldDto: SliderFieldDto): SliderField {
  return {
    id: randomUuidv4(),
    type: FieldType.Slider,
    isTikTokLink: false,
    label: sliderFieldDto.label,
    description: sliderFieldDto.description,
    isRequired: sliderFieldDto.isRequired || false,
    max: sliderFieldDto.max || 100,
    leftLabel: sliderFieldDto.leftLabel || 'Min',
    rightLabel: sliderFieldDto.rightLabel || 'Max',
    step: sliderFieldDto.step || 5,
  };
}
