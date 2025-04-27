import Decimal from 'decimal.js';
import { left, right, type Either } from 'fp-ts/Either';

export const TICK_SIZE = new Decimal(0.1);
export const STEP_SIZE = new Decimal(0.1);
export enum Side {
  Buy = 'buy',
  Sell = 'sell'
}  

export const OrderStatus = {
  OPEN: "OPEN",
  PARTIALLY_FILLED: "PARTIALLY_FILLED",
} as const;

export interface NewOrder {
  side: Side;
  quantity: Decimal;
  price: Decimal;
}

export interface Order extends NewOrder {
  id: string;
  filledQuantity: Decimal;
  timestamp: number;
}

export interface Trade {
  buyOrderId: string;
  sellOrderId: string;
  price: Decimal;
  quantity: Decimal;
  timestamp: number;
}

export interface PriceLevel {
  price: Decimal;
  orders: Order[];
}

export interface OrderBook {
  buy: PriceLevel[];
  sell: PriceLevel[];
}

export interface InsertResult {
  inserted: boolean;
  order: Order;
}

export const validatePrice = (price: Decimal): Either<string, Decimal> => 
  price.mod(TICK_SIZE).eq(0) ? right(price) : left(`Price must align with tick size ${TICK_SIZE.toString()}`);
  
export const validateQuantity = (quantity: Decimal): Either<string, Decimal> => 
  quantity.mod(STEP_SIZE).eq(0) ? right(quantity) : left(`Quantity must align with step size ${STEP_SIZE.toString()}`);

export const validateSide = (side: string): Either<string, Side> => 
  side === 'buy' || side === 'sell' ? right(side as Side) : left('Invalid side');

export const priceToKey = (side: Side, price: Decimal) => `price:${side}:${price.toFixed(1)}`; // Keep 1 decimal place
  
export const orderToJSON = (order: Order) => JSON.stringify(order);
  
export const orderFromJSON = (data: string): Order => JSON.parse(data);

