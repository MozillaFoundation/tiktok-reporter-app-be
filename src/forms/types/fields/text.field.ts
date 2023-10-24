import { Field } from './field';

export class TextField extends Field {
  placeholder: string;
  multiline: boolean;
  maxLines: number;
}
