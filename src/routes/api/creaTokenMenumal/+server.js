import { json } from "@sveltejs/kit"
import { UserModel } from "$lib/server/db/models/User.js"


export async function POST ({request}) {
    const formDataId = await request.formData()
    const id = await formDataId.get('uid')?.valueOf()
    // prendo i dati dell'API dello user corrente dal db
    let dbRes = await UserModel.find({uidFireBase: JSON.parse(id)})
    let userDB = JSON.parse(JSON.stringify(dbRes))[0]
    // setto il form con user e pass API
    const formData = new FormData();
    formData.set('user', userDB.userAPI)
    formData.set('password', userDB.passAPI)
    // invio la richiesta del token
    let res = await fetch('https://menumal.it/api/private/createToken.php',{
        method: 'POST',
        body: formData
    })
    const token = await res.json()
    return json(token)
}