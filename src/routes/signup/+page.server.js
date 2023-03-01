import { UserModel } from "$lib/server/db/models/User.js"
import { dbConnect } from "$lib/server/db/db.js"

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
        //console.log("new user:  " + JSON.stringify(newUser))
         // crea l'utente nel database
         await dbConnect()
         UserModel.create(newUser).then(() => {
            console.log("creato user ")
            return { success: true };
         }).catch((e) => {
            console.log("errore nella creazione dell'utente: \n" + e.message)
            return { error: true, message: e.message }
        })
        
            
    }
}



  