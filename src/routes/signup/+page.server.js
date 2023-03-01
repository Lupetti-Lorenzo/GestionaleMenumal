import { UserModel } from "$lib/server/db/models/User.js"
//import { dbConnect, dbDisconnect } from "$lib/server/db/db.js"

export const actions = {
    default: async ({ request }) => { // singup
        console.log("action singup")
        // get singup data from request form
        const formData = await request.formData();

        const newUser = {
            email: formData.get('email')?.valueOf(),
            uidFireBase: formData.get('uidFireBase')?.valueOf(),
            userAPI: "l.lupetti",
            passAPI: "12345678"
        }
         // crea l'utente nel database
        await UserModel.create(newUser)
        return { success: true };
  }
}



  