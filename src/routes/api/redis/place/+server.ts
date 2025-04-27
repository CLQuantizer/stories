import {json} from "@sveltejs/kit";
import Decimal from "decimal.js";
import { validatePrice, validateQuantity, validateSide } from "@client/common";
import { insertOrder, matchOrder } from "@server/matchingEngine";
import * as E from 'fp-ts/lib/Either';

export const POST = async ({request})=> {
    const body = await request.json() as any;
    const {price, quantity, side} = body;
    const priceValidation = validatePrice(new Decimal(price));
    const quantityValidation = validateQuantity(new Decimal(quantity));
    const sideValidation = validateSide(side);
    if (E.isLeft(priceValidation)) {
        return json({error: priceValidation.left}, {status: 400});
    }
    if (E.isLeft(quantityValidation)) {
        return json({error: quantityValidation.left}, {status: 400});
    }
    if (E.isLeft(sideValidation)) {
        return json({error: sideValidation.left}, {status: 400});
    }
    console.log("placing order:", priceValidation.right, quantityValidation.right, sideValidation.right);
    const order = {id: crypto.randomUUID(), 
        price: priceValidation.right, 
        quantity: quantityValidation.right, 
        side: sideValidation.right, 
        filledQuantity: new Decimal(0), timestamp: Date.now()};
    const processed = await matchOrder(order);
    const returning = await insertOrder(processed);
    if (E.isLeft(returning)) {
        console.log(processed, returning.left);
        return json({message: returning.left});
    }
    return json({order: returning.right}, {status: 200});
}