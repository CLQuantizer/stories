import Decimal from 'decimal.js';

export const TICK_SIZE = new Decimal(0.1);
export const STEP_SIZE = new Decimal(0.1);
export enum Side {
  Buy = 'buy',
  Sell = 'sell'
}  

export interface Order {
    id: string;
    side: Side;
    quantity: Decimal;
    price: Decimal;
}

export function validatePrice(price: Decimal) {
    if (!price.mod(TICK_SIZE).eq(0)) {
      throw new Error(`Price must align with tick size ${TICK_SIZE.toString()}`);
    }
}
  
export function validateQuantity(quantity: Decimal) {
    if (!quantity.mod(STEP_SIZE).eq(0)) {
      throw new Error(`Quantity must align with step size ${STEP_SIZE.toString()}`);
    }
}

export const priceToKey = (side: Side, price: Decimal) => `price:${side}:${price.toFixed(1)}`; // Keep 1 decimal place
  
export const orderToJSON = (order: Order) => JSON.stringify(order);
  
export const orderFromJSON = (data: string): Order => JSON.parse(data);

