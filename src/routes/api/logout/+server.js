import { SESSION_COOKIE_NAME } from "$lib/constants.js"
import { revokeSessionCookie } from "$lib/server/adminFirebase.js"
import { json } from "@sveltejs/kit"

export async function POST({ cookies }) {
	const session = await cookies.get(SESSION_COOKIE_NAME)
	await revokeSessionCookie(session)
	cookies.set(SESSION_COOKIE_NAME, "", {
		path: "/",
		httpOnly: true,
		maxAge: 0
	})
	return json("success")
}
