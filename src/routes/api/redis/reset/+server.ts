import { redis } from "@server/redisClient";
import {json} from "@sveltejs/kit";

export const GET = async ({request})=> {
    await redis.flushall();
    return json({message: "Redis reset"}, {status: 200});
}