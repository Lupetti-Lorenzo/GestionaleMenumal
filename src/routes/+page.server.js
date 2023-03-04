import { deserialize } from "$app/forms";
import { UserModel } from "$lib/server/db/models/User.js"
import { dbConnect } from "$lib/server/db/db.js"

export const actions = {
    creaTokenBackDoor: async ({request, locals}) => {
        // prendo i dati dell'API dello user corrente dal db
        await dbConnect()
        let dbRes = await UserModel.find({uidFireBase: JSON.parse(locals.user)})
        let userDB = JSON.parse(JSON.stringify(dbRes))[0]
        // setto il form con user e pass API
        const formData = await request.formData();
        formData.set('user', userDB.userAPI)
        formData.set('password', userDB.passAPI)
        // invio la richiesta del token
        let res = await fetch('https://menumal.it/api/private/createToken.php',{
            method: 'POST',
            body: formData
        })
        console.log(JSON.stringify(await res.text()))
        const token = deserialize(await res.text());
        return { token }
    },
}