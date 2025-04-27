import Decimal from 'decimal.js';
import { redis } from '@server/redisClient';
import { orderFromJSON, orderToJSON, priceToKey, Side, type Order } from '@server/common';

export async function insertOrder(order: Order) {
    const bookKey = `book:${order.side}`;
    const priceKey = priceToKey(order.side, order.price);
    await redis.zadd(bookKey, Number(order.price).toString(), priceKey);
    await redis.rpush(priceKey, orderToJSON(order));
    return order;
}

export async function matchOrder(incoming: Order) {
    const bookKey = `book:${incoming.side}`;
    let matched = new Decimal(0);
    while (incoming.quantity.gt(0)) {
      const best = await redis.zrange(bookKey, incoming.side === Side.Buy ? -1 : 0, incoming.side === Side.Buy ? -1 : 0);
      if (best.length === 0) break;
  
      const bestPriceKey = best[0];
      const parts = bestPriceKey.split(':');
      const bestPrice = new Decimal(parts[2]);
  
      const priceOk = incoming.side === Side.Buy ? bestPrice.lte(incoming.price) : bestPrice.gte(incoming.price);
      if (!priceOk) break;
  
      const headOrderData = await redis.lindex(bestPriceKey, 0);
      if (!headOrderData) {
        await redis.zrem(bookKey, bestPriceKey);
        continue;
      }
      const headOrder = orderFromJSON(headOrderData);
      const headQty = new Decimal(headOrder.quantity);
  
      const tradeQty = Decimal.min(incoming.quantity, headQty);
      incoming.quantity = incoming.quantity.minus(tradeQty);
      const remainingQty = headQty.minus(tradeQty);
  
      if (remainingQty.lte(0)) {
        await redis.lpop(bestPriceKey);
      } else {
        headOrder.quantity = remainingQty;
        await redis.lset(bestPriceKey, 0, orderToJSON(headOrder));
      }
  
      matched = matched.plus(tradeQty);
  
      console.log(`Trade executed: ${tradeQty.toFixed()} @ ${bestPrice.toFixed(1)}`);
    }
    return matched;
}