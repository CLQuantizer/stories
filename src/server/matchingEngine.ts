import Decimal from 'decimal.js';
import { redis } from '@server/redisClient';
import { priceToKey, Side, type Order, type Trade } from '@client/common';
import * as E from 'fp-ts/lib/Either';

export const insertOrder = async (order: Order): Promise<E.Either<string, Order>> => {
  const remainingQuantity = order.quantity.minus(order.filledQuantity);
  if (remainingQuantity.lte(0)) {
    return E.left('order filled');
  }
  const bookKey = `book:${order.side}`;
  const priceKey = priceToKey(order.side, order.price);
  await redis.zadd(bookKey, { score: Number(order.price), member: priceKey });
  await redis.rpush(priceKey, order);
  console.log(`Order added to book: ${order.id}`);
  return E.right(order);
}

export const matchOrder = async (incoming: Order): Promise<Order> => {
  const oppositeSide = incoming.side === Side.Buy ? Side.Sell : Side.Buy;
  const bookKey = `book:${oppositeSide}`;

  let filledQuantity = new Decimal(incoming.filledQuantity);

  const zrangeIndex = oppositeSide === Side.Buy ? -1 : 0;

  while (filledQuantity.lt(incoming.quantity)) {
    const best = await redis.zrange(bookKey, zrangeIndex, zrangeIndex) as string[];
    if (best.length === 0) break;

    const bestPriceKey = best[0];
    const [, side, priceStr] = bestPriceKey.split(':');
    const bestPrice = new Decimal(priceStr);

    const priceOk = incoming.side === Side.Buy ? bestPrice.lte(incoming.price) : bestPrice.gte(incoming.price);
    if (!priceOk) break;

    const headOrder = await redis.lindex(bestPriceKey, 0);
    if (!headOrder) {
      await redis.zrem(bookKey, bestPriceKey);
      continue;
    }

    const headQty = new Decimal(headOrder.quantity);
    const remainingQuantity = incoming.quantity.minus(filledQuantity);
    const tradeQty = Decimal.min(remainingQuantity, headQty);

    const trade: Trade = {
      buyOrderId: incoming.side === Side.Buy ? incoming.id : headOrder.id,
      sellOrderId: incoming.side === Side.Sell ? incoming.id : headOrder.id,
      price: bestPrice,
      quantity: tradeQty,
      timestamp: Date.now(),
    };

    await redis.rpush('trades', JSON.stringify(trade));

    filledQuantity = filledQuantity.plus(tradeQty);

    if (headQty.minus(tradeQty).lte(0)) {
      await redis.lpop(bestPriceKey);
      const listLen = await redis.llen(bestPriceKey);
      if (listLen === 0) {
        await redis.zrem(bookKey, bestPriceKey);
      }
    } else {
      const updatedHeadOrder = {
        ...headOrder,
        quantity: headQty.minus(tradeQty),
        filledQuantity: new Decimal(headOrder.filledQuantity).plus(tradeQty),
      };
      await redis.lset(bestPriceKey, 0, updatedHeadOrder);
    }

    console.log(`Trade executed: ${tradeQty.toFixed()} @ ${bestPrice.toFixed(1)}`);
  }

  return {
    ...incoming,
    filledQuantity,
    timestamp: Date.now(),
  };
};
