import { SESSION_COOKIE_NAME } from "$lib/constants.js"
import { revokeSessionCookie } from "$lib/server/adminFirebase.js"

export const POST = (async ({ cookies }) => {
    const session = await cookies.get(SESSION_COOKIE_NAME)
    await revokeSessionCookie(session)
    cookies.delete(SESSION_COOKIE_NAME)
    return new Response("")
})