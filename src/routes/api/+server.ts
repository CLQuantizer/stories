import {json} from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({platform }:any) {
    return json({});
}