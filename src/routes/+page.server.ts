import ky from "ky";
import {z} from "zod";

export const load = async ({platform})=> {
    const data = await ky.get(platform?.env.ME_URL+'/books').json() as {buys: any, sells: any, timestamp: string};
    const trades = await ky.get(platform?.env.ME_URL+'/trades').json() as any;
    const timestamp = z.date().parse(new Date(data.timestamp));
    const {buys, sells} = data
    return {timestamp, buys, sells, trades}
}
