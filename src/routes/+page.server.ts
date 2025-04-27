import ky from "ky";
import {z} from "zod";
import { ME_URL } from "$env/static/private";
import { redis } from "@server/redisClient";

export const load = async ({})=> {
    await redis.set('hello', 'world');
    const value = await redis.get('hello');
    console.log("redis value", value);
    const data = await ky.get(ME_URL+'/books').json() as {buys: any, sells: any, timestamp: string};
    const trades = await ky.get(ME_URL+'/trades').json() as any;
    const timestamp = z.date().parse(new Date(data.timestamp));
    const {buys, sells} = data
    return {timestamp, buys, sells, trades}
}
