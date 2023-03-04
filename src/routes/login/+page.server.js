import { createSessionCookie } from "$lib/server/adminFirebase.js"
import { SESSION_COOKIE_NAME } from "$lib/constants.js"
import { UserModel } from "$lib/server/db/models/User.js"
import { dbConnect } from "$lib/server/db/db.js"

export const actions = {
    default: async ({ request, cookies }) => { // login
        console.log("action login")
        // get token and uid from request form
        const formData = await request.formData()
        const token = await formData.get('token')?.valueOf()
        const id = await formData.get('uid')?.valueOf()
        // check if user exists in mongoDB
        await dbConnect()
        let dbRes = await UserModel.find({uidFireBase: id})
        let dbUsers = JSON.parse(JSON.stringify(dbRes))
        if (JSON.stringify(dbUsers) === '[]') return { error: true }

        // check token
        if (!token) return { error: true, message: "no token provided" }
        if (typeof token !== 'string') return { error: true, message: 'Token is a required field and must be a string' }

        //set cookies
        const maxAge = 60 * 60 * 24 * 14; // 14 days in seconds
        const sessionCookie = await createSessionCookie(token, maxAge)
        console.log("created session cookie: " + JSON.stringify(sessionCookie))

        cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: maxAge
        })
        return { success: true };
  }
}



  