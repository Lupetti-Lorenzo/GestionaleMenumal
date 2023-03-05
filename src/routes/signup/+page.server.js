import { UserModel } from "$lib/server/db/models/User.js"

export const actions = {
    default: async ({ request }) => { // singup
        console.log("action singup")
        // get singup data from request form
        const formData = await request.formData();
        
        // qui manca la chiamata a leo per chiedere un nuovo user apikey
        const newUser = {
            email: formData.get('email')?.valueOf(),
            uidFireBase: formData.get('uidFireBase')?.valueOf(),
            userAPI: "l.lupetti",
            passAPI: "12345678"
        }
         // crea l'utente nel database
        let user = await UserModel.create(newUser)
        if (user instanceof UserModel) {
            console.log("creato user")
            return { success: true }
        }
        else {
            console.log("errore nella creazione dell'utente nel db")
            return { error: true, message: "errore nella creazione dell'utente nel db" }
        }
    }
}



  