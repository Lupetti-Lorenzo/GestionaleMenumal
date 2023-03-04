import { getFirebase } from "$lib/client/firebase"
import { getAdmin } from "$lib/server/adminFirebase"
import { UserModel } from "$lib/server/db/models/User.js"
import { dbConnect } from "$lib/server/db/db.js"

export const load = (async (event) => {
    getFirebase()
    getAdmin()
    const id = event.locals.user
    if (!id) return {}

    const user = { id }
    // chiamata a database per fornire al client anche i dati non segreti(apiKey) del database
    await dbConnect()
    let dbRes = await UserModel.find({uidFireBase: JSON.parse(id)})
    let dbUser = JSON.parse(JSON.stringify(dbRes))[0]
    let { email, locali } = dbUser
    user.email = email
    user.locali = locali
     
    return { user }  // questo user aggiorna auth.js
}) // se non ce id authUser diventa null