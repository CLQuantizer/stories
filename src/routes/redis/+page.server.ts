import { getBooks } from "@server/getBooks";

export const load = async ()=> {
    const books = await getBooks()
    console.log("books", books);
    return {buy: books.buy, sell: books.sell};
}
