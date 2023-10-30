import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  public validate = async (
    apiKey: string,
    done: (error: Error, data) => object,
  ) => {
    const doesApiKeyExist = await this.apiKeyRepository.exist({
      where: {
        key: apiKey,
      },
    });

    if (doesApiKeyExist) {
      done(null, true);
    }

    done(new UnauthorizedException(), null);
  };
}
