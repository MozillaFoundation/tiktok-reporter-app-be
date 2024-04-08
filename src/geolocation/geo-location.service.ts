import { Injectable, Logger } from '@nestjs/common';

import { OpenOpts } from 'maxmind/lib';
import { WebServiceClient, Reader } from '@maxmind/geoip2-node';
import { isIP } from 'net';

const getFileBasedIpAddress = async (ipAddress: string) => {
  const options: OpenOpts = {};

  const GEO_LOCATION_DATABASE_PATH =
    process.env.GEO_LOCATION_DATABASE_PATH ||
    '/usr/share/GeoIP/GeoIP2-Country.mmdb';

  const reader = await Reader.open(GEO_LOCATION_DATABASE_PATH, options);
  return reader.country(ipAddress);
};

const getWebBasedIpAddress = async (ipAddress: string) => {
  const client = new WebServiceClient(
    process.env.GEO_LOCATION_ACCOUNT_ID,
    process.env.GEO_LOCATION_API_KEY,
    { host: 'geolite.info' },
  );
  return await client.country(ipAddress);
};

const getIpAddress =
  (process.env.GEO_LOCATION_LOOKUP_TYPE || 'file') === 'file'
    ? getFileBasedIpAddress
    : getWebBasedIpAddress;

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

      const userCountry = await getIpAddress(ipAddress);

      this.logger.error('The geoip2-node result', JSON.stringify(userCountry));

      const isValidCountry = !!userCountry.country && !!userCountry.traits;

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
