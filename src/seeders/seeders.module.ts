import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCode])],
})
export class SeedersModule {
  constructor(
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
  ) {}

  async onModuleInit() {
    try {
      const countryCodeCount = await this.countryCodeRepository.count();
      if (countryCodeCount === 0) {
        for (let i = 0; i < availableCountryCodes.length; i++) {
          const availableCountryCode = availableCountryCodes[i];
          await this.countryCodeRepository.save({
            countryName: availableCountryCode.countryName,
            code: availableCountryCode.countryCode,
          });
        }
      }
    } catch (error) {
      console.error('Something went wrong while seeding', error.message);
    }
  }
}

const availableCountryCodes = [
  { countryName: 'Afghanistan', countryCode: 'af' },
  { countryName: 'Algeria', countryCode: 'dz' },
  { countryName: 'Angola', countryCode: 'ao' },
  { countryName: 'Argentina', countryCode: 'ar' },
  { countryName: 'Australia', countryCode: 'au' },
  { countryName: 'Austria', countryCode: 'at' },
  { countryName: 'Bangladesh', countryCode: 'bd' },
  { countryName: 'Belarus', countryCode: 'by' },
  { countryName: 'Belgium', countryCode: 'be' },
  { countryName: 'Bolivia', countryCode: 'bo' },
  { countryName: 'Bosnia And Herzegovina', countryCode: 'ba' },
  { countryName: 'Botswana', countryCode: 'bw' },
  { countryName: 'Brazil', countryCode: 'br' },
  { countryName: 'Bulgaria', countryCode: 'bg' },
  { countryName: 'Cambodia', countryCode: 'kh' },
  { countryName: 'Cameroon', countryCode: 'cm' },
  { countryName: 'Canada', countryCode: 'ca' },
  { countryName: 'Chile', countryCode: 'cl' },
  { countryName: 'China', countryCode: 'cn' },
  { countryName: 'Colombia', countryCode: 'co' },
  { countryName: 'Congo, The Democratic Republic Of The', countryCode: 'cd' },
  { countryName: 'Costa Rica', countryCode: 'cr' },
  { countryName: "Cote D'ivoire", countryCode: 'ci' },
  { countryName: 'Croatia', countryCode: 'hr' },
  { countryName: 'Cyprus', countryCode: 'cy' },
  { countryName: 'Czech Republic', countryCode: 'cz' },
  { countryName: 'Denmark', countryCode: 'dk' },
  { countryName: 'Dominican Republic', countryCode: 'do' },
  { countryName: 'Ecuador', countryCode: 'ec' },
  { countryName: 'Egypt', countryCode: 'eg' },
  { countryName: 'El Salvador', countryCode: 'sv' },
  { countryName: 'Estonia', countryCode: 'ee' },
  { countryName: 'Finland', countryCode: 'fi' },
  { countryName: 'France', countryCode: 'fr' },
  { countryName: 'Gabon', countryCode: 'ga' },
  { countryName: 'Georgia', countryCode: 'ge' },
  { countryName: 'Germany', countryCode: 'de' },
  { countryName: 'Greece', countryCode: 'gr' },
  { countryName: 'Guatemala', countryCode: 'gt' },
  { countryName: 'Honduras', countryCode: 'hn' },
  { countryName: 'Hong Kong', countryCode: 'hk' },
  { countryName: 'Hungary', countryCode: 'hu' },
  { countryName: 'Iceland', countryCode: 'is' },
  { countryName: 'India', countryCode: 'in' },
  { countryName: 'Indonesia', countryCode: 'id' },
  { countryName: 'Iran, Islamic Republic Of', countryCode: 'ir' },
  { countryName: 'Iraq', countryCode: 'iq' },
  { countryName: 'Ireland', countryCode: 'ie' },
  { countryName: 'Israel', countryCode: 'il' },
  { countryName: 'Italy', countryCode: 'it' },
  { countryName: 'Japan', countryCode: 'jp' },
  { countryName: 'Jordan', countryCode: 'jo' },
  { countryName: 'Kazakstan', countryCode: 'kz' },
  { countryName: 'Kenya', countryCode: 'ke' },
  { countryName: 'Korea, Republic Of', countryCode: 'kr' },
  { countryName: 'Kuwait', countryCode: 'kw' },
  { countryName: "Lao People's Democratic Republic", countryCode: 'la' },
  { countryName: 'Latvia', countryCode: 'lv' },
  { countryName: 'Lebanon', countryCode: 'lb' },
  { countryName: 'Libyan Arab Jamahiriya', countryCode: 'ly' },
  { countryName: 'Lithuania', countryCode: 'lt' },
  { countryName: 'Luxembourg', countryCode: 'lu' },
  { countryName: 'Macau', countryCode: 'mo' },
  { countryName: 'Malawi', countryCode: 'mw' },
  { countryName: 'Malaysia', countryCode: 'my' },
  { countryName: 'Maldives', countryCode: 'mv' },
  { countryName: 'Mexico', countryCode: 'mx' },
  { countryName: 'Montenegro', countryCode: 'me' },
  { countryName: 'Morocco', countryCode: 'ma' },
  { countryName: 'Myanmar', countryCode: 'mm' },
  { countryName: 'Nauru', countryCode: 'nr' },
  { countryName: 'Netherlands', countryCode: 'nl' },
  { countryName: 'New Zealand', countryCode: 'nz' },
  { countryName: 'Nicaragua', countryCode: 'ni' },
  { countryName: 'Nigeria', countryCode: 'ng' },
  { countryName: 'Norway', countryCode: 'no' },
  { countryName: 'Oman', countryCode: 'om' },
  { countryName: 'Pakistan', countryCode: 'pk' },
  { countryName: 'Panama', countryCode: 'pa' },
  { countryName: 'Paraguay', countryCode: 'py' },
  { countryName: 'Peru', countryCode: 'pe' },
  { countryName: 'Philippines', countryCode: 'ph' },
  { countryName: 'Poland', countryCode: 'pl' },
  { countryName: 'Portugal', countryCode: 'pt' },
  { countryName: 'Qatar', countryCode: 'qa' },
  { countryName: 'Romania', countryCode: 'ro' },
  { countryName: 'Russian Federation', countryCode: 'ru' },
  { countryName: 'Rwanda', countryCode: 'rw' },
  { countryName: 'Saudi Arabia', countryCode: 'sa' },
  { countryName: 'Senegal', countryCode: 'sn' },
  { countryName: 'Serbia', countryCode: 'rs' },
  { countryName: 'Singapore', countryCode: 'sg' },
  { countryName: 'Slovakia', countryCode: 'sk' },
  { countryName: 'Slovenia', countryCode: 'si' },
  { countryName: 'South Africa', countryCode: 'za' },
  { countryName: 'Spain', countryCode: 'es' },
  { countryName: 'Sri', countryCode: 'lk' },
  { countryName: 'Sweden', countryCode: 'se' },
  { countryName: 'Switzerland', countryCode: 'ch' },
  { countryName: 'Taiwan, Province Of China', countryCode: 'tw' },
  { countryName: 'Tanzania', countryCode: 'tz' },
  { countryName: 'Thailand', countryCode: 'th' },
  { countryName: 'The Republic of Kosovo', countryCode: 'xk' },
  { countryName: 'Tonga', countryCode: 'to' },
  { countryName: 'Tunisia', countryCode: 'tn' },
  { countryName: 'Turkey', countryCode: 'tr' },
  { countryName: 'Uganda', countryCode: 'ug' },
  { countryName: 'Ukraine', countryCode: 'ua' },
  { countryName: 'United Arab Emirates', countryCode: 'ae' },
  { countryName: 'United Kingdom', countryCode: 'gb' },
  { countryName: 'United States', countryCode: 'us' },
  { countryName: 'Uruguay', countryCode: 'uy' },
  { countryName: 'Vanuatu', countryCode: 'vu' },
  { countryName: 'Venezuela', countryCode: 've' },
  { countryName: 'Viet Nam', countryCode: 'vn' },
  { countryName: 'Zambia', countryCode: 'zm' },
  { countryName: 'Zimbabwe', countryCode: 'zw' },
];
