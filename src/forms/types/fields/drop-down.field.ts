import { Field } from './field';
import { Option } from './option';

export class DropDownField extends Field {
  placeholder: string;
  options: Array<Option>;
  selected: string;
  hasOtherOption: boolean;
}
