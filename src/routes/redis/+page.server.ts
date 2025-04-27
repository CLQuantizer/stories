import { redis } from "@server/redisClient";

export const load = async ()=> {
    await redis.set('hello', 'world');
    const value = await redis.get('hello');
    console.log("redis value", value);
    await redis.del('hello');
    return {value};
}
