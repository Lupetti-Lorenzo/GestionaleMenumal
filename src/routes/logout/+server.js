import { SESSION_COOKIE_NAME } from "$lib/constants.js"


export const POST = (async ({ cookies }) => {
    cookies.delete(SESSION_COOKIE_NAME)
    return new Response("");
})