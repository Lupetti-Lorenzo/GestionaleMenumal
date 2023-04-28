import { getFirebase } from "$lib/client/firebase"
import { getAdmin } from "$lib/server/adminFirebase"
import { dbConnect } from "$lib/server/db/db.js"
import { getUser } from "$lib/server/db/db"

export const load = (async (event) => {
    getFirebase()
    getAdmin()
    await dbConnect()
    const id = event.locals.user
    if (!id) return {}

    const user = { id }
    // chiamata a database per fornire al client anche i dati non segreti(apiKey) del database
    const dbUser = await getUser(id)
    let { email, locali } = dbUser
    user.email = email
    user.locali = locali
     
    return { user }  // questo user aggiorna auth.js
}) // se non ce id authUser diventa null