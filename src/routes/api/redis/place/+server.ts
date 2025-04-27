import {json} from "@sveltejs/kit";
import Decimal from "decimal.js";
import { validatePrice, validateQuantity } from "@server/common";
import { insertOrder, matchOrder } from "@server/matchingEngine";

export const POST = async ({request})=> {
    const body = await request.json() as any;
    const price = new Decimal(body.price);
    const quantity = new Decimal(body.quantity);
    validatePrice(price);
    validateQuantity(quantity);
    const side = body.side?.toLowerCase();
    // validate side
    if (side !== 'buy' && side !== 'sell') {
        return json({error: 'Invalid side'}, {status: 400});
    }
    const order = {id: crypto.randomUUID(), price, quantity, side};
    const res = await matchOrder(order);
    const inserted = await insertOrder(order);
    console.log("placing order:", res, inserted);
    return json({res, inserted});
}