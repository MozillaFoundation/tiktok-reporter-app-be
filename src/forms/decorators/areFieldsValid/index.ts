import { FormFieldValidator } from 'src/forms/validators/form-field.validator';
import { registerDecorator } from 'class-validator';

export function AreFieldsValid() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'areFieldsValid',
      target: object.constructor,
      propertyName: propertyName,
      validator: FormFieldValidator,
    });
  };
}
