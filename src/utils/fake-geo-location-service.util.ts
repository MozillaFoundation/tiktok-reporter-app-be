import { GeolocationService } from 'src/geolocation/geo-location.service';
import { defaultCreateCountryCodeDto } from './constants';
import { isIP } from 'net';

export const fakeGeolocationService: Partial<GeolocationService> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCountryCodeByIpAddress: async (ipAddress: string) => {
    const isIpAddress = isIP(ipAddress);
    if (isIpAddress === 0) {
      return null;
    }

    return defaultCreateCountryCodeDto.countryCode;
  },
};
