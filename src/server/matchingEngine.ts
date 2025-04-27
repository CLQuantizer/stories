import Decimal from 'decimal.js';
import { redis } from '@server/redisClient';
import { orderFromJSON, orderToJSON, priceToKey, Side, tradeToJSON, type Order, type Trade } from '@client/common';
import * as E from 'fp-ts/lib/Either';

export const insertOrder = async (order: Order): Promise<E.Either<string, Order>> => {
  if (order.quantity.lte(0)) {
    return E.left('order filled');
  }
  const bookKey = `book:${order.side}`;
  const priceKey = priceToKey(order.side, order.price);
  await redis.zadd(bookKey, Number(order.price).toString(), priceKey);
  await redis.rpush(priceKey, orderToJSON(order));
  return E.right(order);
}

export const matchOrder = async(incoming: Order): Promise<Order> =>{
  const oppositeSide = incoming.side === Side.Buy ? Side.Sell : Side.Buy;
  const bookKey = `book:${oppositeSide}`;

  let remainingQuantity = incoming.quantity;
  let filledQuantity = new Decimal(0);

  while (remainingQuantity.gt(0)) {
    const best = await redis.zrange(bookKey, oppositeSide === Side.Buy ? -1 : 0, oppositeSide === Side.Buy ? -1 : 0);
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

    const tradeQty = Decimal.min(remainingQuantity, headQty);

    const trade: Trade = {
      buyOrderId: incoming.id,
      sellOrderId: headOrder.id,
      price: bestPrice,
      quantity: tradeQty,
      timestamp: Date.now(),
    }

    await redis.rpush('trades', tradeToJSON(trade));
    remainingQuantity = remainingQuantity.minus(tradeQty);

    if (headQty.minus(tradeQty).lte(0)) {
      await redis.lpop(bestPriceKey);
    } else {
      const updatedHeadOrder = {
        ...headOrder,
        quantity: headQty.minus(tradeQty),
      };
      await redis.lset(bestPriceKey, 0, orderToJSON(updatedHeadOrder));
    }

    filledQuantity = filledQuantity.plus(tradeQty);

    console.log(`Trade executed: ${tradeQty.toFixed()} @ ${bestPrice.toFixed(1)}`);
  }

  return {
    ...incoming,
    quantity: remainingQuantity,
    filledQuantity: filledQuantity,
    timestamp: Date.now(),
  };
}
