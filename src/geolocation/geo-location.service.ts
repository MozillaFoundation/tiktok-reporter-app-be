import { Injectable, Logger } from '@nestjs/common';

import { WebServiceClient } from '@maxmind/geoip2-node';
import { isIP } from 'net';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);

  async getCountryCodeByIpAddress(ipAddress: string) {
    try {
      const isIpAddress = isIP(ipAddress);
      if (isIpAddress === 0) {
        this.logger.error('The user ipAddress is not valid');
        return null;
      }

      const client = new WebServiceClient(
        process.env.GEO_LOCATION_ACCOUNT_ID,
        process.env.GEO_LOCATION_API_KEY,
        { host: 'geolite.info' },
      );
      const userCountry = await client.country(ipAddress);

      this.logger.error('The geoip2-node result', JSON.stringify(userCountry));

      const isValidCountry =
        userCountry.hasOwnProperty('country') &&
        userCountry.hasOwnProperty('traits');

      if (!isValidCountry) {
        this.logger.error(
          'Geo Location service did not provide a valid country',
        );
        return null;
      }

      if (userCountry.traits.ipAddress !== ipAddress) {
        this.logger.error(
          'Geo Location service did not provide a valid country',
        );
        return null;
      }

      return userCountry.country.isoCode.toLowerCase();
    } catch (error) {
      // In e2e tests this error is fine
      this.logger.error(
        'Something went wrong while retrieving country code',
        error,
      );
      return null;
    }
  }
}
