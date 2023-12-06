import {
  DEFAULT_THROTTLER_LIMIT,
  DEFAULT_THROTTLER_TTL_IN_MS,
} from './constants';

export function getThrottlerTtl() {
  return Number(process.env.THROTTLER_TTL_IN_MS || DEFAULT_THROTTLER_TTL_IN_MS);
}

export function getThrottlerLimit() {
  return Number(process.env.THROTTLER_LIMIT || DEFAULT_THROTTLER_LIMIT);
}
