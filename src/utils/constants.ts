import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { CreateOnboardingDto } from 'src/onboardings/dtos/create-onboarding.dto';
import { CreateOnboardingStepDto } from 'src/onboardingSteps/dtos/create-onboarding-step.dto';
import { CreatePolicyDto } from 'src/policies/dtos/create-policy.dto';
import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { PolicyType } from 'src/types/policy.type';

export const DEFAULT_GUID = '00000000-0000-0000-0000-000000000000';

export const defaultCreateStudyDto: CreateStudyDto = {
  name: 'Test Create Study',
  description: 'The Description of the new Created Study',
  isActive: true,
  countryCodeIds: [],
  policyIds: [],
  onboardingId: '',
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
  description: 'Test Onboarding Step Description',
  imageUrl: 'Test Onboarding Step ImageURL',
  details: 'Test Onboarding Step Details',
  order: 1,
};

export const defaultCreateOnboardingDto: CreateOnboardingDto = {
  name: 'Test Onboarding Step Name',
  stepIds: ['1', '2', '3'],
};
