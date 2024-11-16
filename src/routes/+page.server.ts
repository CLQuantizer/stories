import ky from "ky";
import {z} from "zod";

export const load = async ({platform})=> {
    const data = await ky.get(platform?.env.ME_URL+'/books').json() as any;
    const trades = await ky.get(platform?.env.ME_URL+'/trades').json() as any;
    const timestamp = z.date().parse(new Date(data.timestamp));
    const buys = data.buyOrders;
    const sells = data.sellOrders;
    return {timestamp, buys, sells, trades};
}
