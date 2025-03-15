import ky from "ky";

export const load = async ({platform})=> {
    const data = await ky.get(platform?.env.ME_URL+'/books').json() as {buy: any, sell: any};
    // const trades = await ky.get(platform?.env.ME_URL+'/trades').json() as any;
    const timestamp = new Date();
    const buys = data.buy;
    const sells = data.sell;
    return {timestamp, buys: buys?buys:[], sells: sells?sells:[]};
}
