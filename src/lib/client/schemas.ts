import { z } from "zod";

export const Side = {
    BUY: "BUY",
    SELL: "SELL",
} as const;

export const OrderStatus = {
    OPEN: "OPEN",
    FILLED: "FILLED",
    PARTIALLY_FILLED: "PARTIALLY_FILLED",
    CANCELLED: "CANCELLED",
} as const;

// Create a reusable decimal validator
const DecimalNumber = z.number()
    .positive()
    .transform((n) => Number(n.toFixed(2))) // This automatically handles decimal places
    .refine((n) => Number.isFinite(n), "Must be a valid number");

// Schema for creating new orders
export const NewOrderSchema = z.object({
    userId: z.string(),
    side: z.enum([Side.BUY, Side.SELL]),
    timestamp: z.number(),
    price: DecimalNumber,
    quantity: DecimalNumber,
});

// Full order schema extends new order schema with additional fields
export const OrderSchema = NewOrderSchema.extend({
    id: z.string().uuid(),
    status: z.enum([
        OrderStatus.OPEN,
        OrderStatus.FILLED,
        OrderStatus.PARTIALLY_FILLED,
        OrderStatus.CANCELLED,
    ]),
    filledQuantity: DecimalNumber.default(0),
});

export const TradeSchema = z.object({
    buyOrderId: z.string(),
    sellOrderId: z.string(),
    price: DecimalNumber,
    quantity: DecimalNumber,
    timestamp: z.number(),
});

export const priceLevelSchema = z.object({
    price: DecimalNumber,
    orders: z.array(OrderSchema),
});

const OrderBookSchema = z.record(z.array(priceLevelSchema));

export type PriceLevel = z.infer<typeof priceLevelSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Trade = z.infer<typeof TradeSchema>;
export type OrderBook = z.infer<typeof OrderBookSchema>;