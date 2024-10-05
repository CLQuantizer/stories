import {json} from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({platform }:any) {
    const result = await platform.env.DB.prepare(
        "SELECT * FROM stories"
    ).run();
    return json(result);
}