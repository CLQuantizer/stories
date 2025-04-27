import type { Trade } from "@/client/common";
import { getBooks } from "@server/getBooks";
import { redis } from "@server/redisClient";

const serializeOrder = (order: any) => ({
    id: order.id,
    side: order.side,
    quantity: order.quantity.toString(),
    price: order.price.toString(),
    filledQuantity: order.filledQuantity.toString(),
    timestamp: order.timestamp,
});


const serializeBook = (book: any[]) => book.map(level => ({
    price: level.price,
    orders: level.orders.map(serializeOrder),
}));

export const load = async () => {
    const books = await getBooks();
    const trades = await redis.lrange('trades', 0, -1) as Trade[];
    return {
        buy: serializeBook(books.buy),
        sell: serializeBook(books.sell),
        trades,
        timestamp: new Date().toISOString(),
    };
};
