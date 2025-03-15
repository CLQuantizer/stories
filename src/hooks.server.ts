import type {Handle} from "@sveltejs/kit";
import {env} from "$env/dynamic/private";

export const handle:Handle =  async ({ event, resolve }) => {
    event.locals.URL = event.platform?.env.ME_URL? event.platform?.env.ME_URL: env.URL as string;
    return resolve(event);
}
