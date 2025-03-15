import ky from "ky";
import {json} from "@sveltejs/kit";

export const POST = async ({request, platform})=> {
    try {
        const body = await request.json() as any;
        const price = +body.price;
        const quantity = +body.quantity;
        const side = body.side.toUpperCase();
        const URL = platform?.env.ME_URL
        const res = await ky.post(URL + '/place', {json: {side, price, quantity}}).json();
        console.log("placing order:", res);
        return json(res);
    } catch (error: any) {
        console.error(error);
        return json({error: error.message});
    }
}