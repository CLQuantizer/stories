import { tradeFromJSON } from "@/client/common";
import { getBooks } from "@server/getBooks";
import { redis } from "@server/redisClient";

export const load = async ()=> {
    const books = await getBooks()
    const trades = await redis.lrange('trades', 0, -1);
    const tradesData = trades.map(trade => tradeFromJSON(trade))
    return {buy: books.buy, sell: books.sell, trades: tradesData, timestamp: new Date().toISOString()};
}
