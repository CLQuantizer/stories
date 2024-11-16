import ky from "ky";

export const load = async ({platform})=> {
    const books = await ky.get(platform?.env.ME_URL+'/books').json()
    console.log(books);
    return {data: books};
}