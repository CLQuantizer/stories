import Decimal from 'decimal.js';
import { redis } from '@server/redisClient';
import { Side, type Order } from '@client/common';

export async function getBooks() {
  const sides: Side[] = [Side.Buy, Side.Sell];
  const result: Record<Side, Array<{
    price: number;
    orders: Array<Order>;
  }>> = {
    [Side.Buy]: [],
    [Side.Sell]: []
  };

  for (const side of sides) {
    const bookKey = `book:${side}`;

    const priceKeys = await redis.zrange(bookKey, 0, -1) as string[];

    for (const priceKey of priceKeys) {
      if (!priceKey) continue;

      const parts = priceKey.split(':');
      const price = parseFloat(parts[2]);
      if (isNaN(price)) {
        console.error('Invalid price key:', priceKey);
        continue;
      }

      const ordersRaw = await redis.lrange(priceKey, 0, -1);
      const orders: Order[] = [];

      for (const raw of ordersRaw) {
        if (typeof raw === 'object' && raw !== null) {
          try {
            orders.push({
              id: raw.id,
              side: raw.side,
              quantity: new Decimal(raw.quantity),
              price: new Decimal(raw.price),
              filledQuantity: new Decimal(raw.filledQuantity),
              timestamp: raw.timestamp,
            } as Order);
          } catch (e) {
            console.error('Failed to parse order object:', raw);
            throw e;
          }
        } else {
          console.error('Non-object data found in Redis list, removing:', raw);
          await redis.lrem(priceKey, 1, raw);
          // Skip this invalid entry
        }
      }

      result[side].push({
        price,
        orders
      });
    }

    result[side].sort((a, b) => side === Side.Buy ? b.price - a.price : a.price - b.price);
  }

  return result;
}