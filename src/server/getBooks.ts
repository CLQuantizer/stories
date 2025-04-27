import { redis } from '@server/redisClient';
import { Side, orderFromJSON, type Order } from '@client/common';

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
      const priceKeys = await redis.zrange(bookKey, 0, -1, 'WITHSCORES');
  
      for (let i = 0; i < priceKeys.length; i += 2) {
        const priceKey = priceKeys[i];
        const price = Number(priceKeys[i + 1]);
  
        const ordersRaw = await redis.lrange(priceKey, 0, -1);
        const orders = ordersRaw.map(raw => {
          const parsed = orderFromJSON(raw);
          return {
            id: parsed.id,
            quantity: Number(parsed.quantity),
            filledQuantity: Number(parsed.filledQuantity),
            timestamp: parsed.timestamp
          };
        });
        result[side].push({
          price,
          orders
        });
      }
      // Sort: for buy - descending, for sell - ascending
      result[side].sort((a, b) => side === Side.Buy ? b.price - a.price : a.price - b.price);
    }
  
    return result;
  }
  