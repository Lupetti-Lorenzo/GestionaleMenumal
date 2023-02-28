import { getFirebase } from "$lib/client/firebase"
import { getAdmin } from "$lib/server/adminFirebase"

export const load = (async (event) => {
    getFirebase()
    getAdmin()
    const user = event.locals.user;
    //if (user)
      // fetch user data from db
    return { user }
  })