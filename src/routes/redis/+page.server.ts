import { getBooks } from "@server/getBooks";

export const load = async ()=> {
    const books = await getBooks()
    return {buy: books.buy, sell: books.sell, trades: [], timestamp: new Date().toISOString()};
}
