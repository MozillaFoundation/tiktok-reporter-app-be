import { Field } from './field';

export class SliderField extends Field {
  max: number;
  leftLabel: string;
  rightLabel: string;
  step: number;
}
