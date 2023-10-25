import { mapStudiesToDtos } from 'src/studies/mappers/mapEntitiesToDto';
import { CountryCodeDto } from '../dtos/country-code.dto';
import { CountryCode } from '../entities/country-code.entity';
import { isFilledArray } from 'src/utils/isFilledArray';

export function mapCountryCodesToDtos(
  countryCodes: Array<CountryCode>,
): Array<CountryCodeDto> {
  if (!isFilledArray(countryCodes)) {
    return [];
  }
  const countryCodesDtos = [];
  for (const countryCode of countryCodes) {
    countryCodesDtos.push(mapCountryCodeEntityToDto(countryCode));
  }

  return countryCodesDtos;
}

export function mapCountryCodeEntityToDto(
  countryCode: CountryCode,
): CountryCodeDto {
  return {
    id: countryCode.id,
    countryName: countryCode.countryName,
    code: countryCode.code,
    studies: mapStudiesToDtos(countryCode?.studies),
    createdAt: countryCode.createdAt,
    updatedAt: countryCode.updatedAt,
  } as CountryCodeDto;
}
