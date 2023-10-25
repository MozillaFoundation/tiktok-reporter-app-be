import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { CreateFormDto } from 'src/forms/dtos/create-form.dto';
import { CreateOnboardingDto } from 'src/onboardings/dtos/create-onboarding.dto';
import { CreateOnboardingStepDto } from 'src/onboardingSteps/dtos/create-onboarding-step.dto';
import { CreatePolicyDto } from 'src/policies/dtos/create-policy.dto';
import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { DropDownFieldDto } from 'src/forms/dtos/drop-down-field.dto';
import { FieldType } from 'src/forms/types/fields/field.type';
import { PolicyType } from 'src/types/policy.type';
import { SliderFieldDto } from 'src/forms/dtos/slider-field.dto';
import { TextFieldDto } from 'src/forms/dtos/text-field.dto';

export const DEFAULT_GUID = '00000000-0000-0000-0000-000000000000';

export const defaultCreateStudyDto: CreateStudyDto = {
  name: 'Test Create Study',
  description: 'The Description of the new Created Study',
  isActive: true,
  countryCodeIds: [],
  policyIds: [],
  onboardingId: '1',
  formId: '1',
};

export const defaultCreateCountryCodeDto: CreateCountryCodeDto = {
  countryCode: 'Test Country Code',
  countryName: 'Test Country Code Name',
};

export const defaultCreatePolicyDto: CreatePolicyDto = {
  type: PolicyType.TermsOfService,
  title: 'Test Policy Title',
  subtitle: 'Test Policy SubTitle',
  text: 'Test Policy Text',
};

export const defaultCreateOnboardingStepDto: CreateOnboardingStepDto = {
  title: 'Test Onboarding Step Title',
  subtitle: 'Test Onboarding Step SubTitle',
  description: 'Test Onboarding Step Description',
  imageUrl: 'Test Onboarding Step ImageURL',
  details: 'Test Onboarding Step Details',
  order: 1,
};

export const defaultCreateOnboardingDto: CreateOnboardingDto = {
  name: 'Test Onboarding Name',
  stepIds: ['1', '2', '3'],
  formId: '1',
};

export const defaultCreateFormDto: CreateFormDto = {
  name: 'Test Form Create',
  fields: [
    {
      type: FieldType.TextField,
      label: 'Text Field Label',
      description: 'Text Field description',
      placeholder: 'Text Field Placeholder',
      isRequired: true,
      multiline: true,
      maxLines: 2,
    } as TextFieldDto,
    {
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
    } as DropDownFieldDto,
    {
      type: FieldType.Slider,
      label: 'Slider Field Label',
      description: 'Slider Field description',
      isRequired: true,
      max: 1000,
      leftLabel: 'Left Label',
      rightLabel: 'Right Label',
      step: 5,
    } as SliderFieldDto,
  ],
};
