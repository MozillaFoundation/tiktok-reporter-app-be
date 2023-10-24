import { FieldType } from './field.type';

export abstract class Field {
  id: string;
  type: FieldType;
  label: string;
  isRequired: boolean;
}
