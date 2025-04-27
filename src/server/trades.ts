import { redis } from './redisClient';
import { tradeToJSON } from '@client/common';
import type { Trade } from '@client/common';

export async function persistTrade(trade: Trade): Promise<void> {
  await redis.rpush('trades', tradeToJSON(trade));
}
