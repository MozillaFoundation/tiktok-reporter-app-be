import { CreateCountryCodeDto } from 'src/countryCodes/dtos/create-country-code.dto';
import { CreatePolicyDto } from 'src/policies/dtos/create-policy.dto';
import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { PolicyType } from 'src/models/policyType';

export const DEFAULT_GUID = '00000000-0000-0000-0000-000000000000';

export const defaultCreateStudyDto: CreateStudyDto = {
  name: 'Test Create Study',
  description: 'The Description of the new Created Study',
  countryCodeIds: [],
  policyIds: [],
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
