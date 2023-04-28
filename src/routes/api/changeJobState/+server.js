import { json } from "@sveltejs/kit"
import { getUser } from "$lib/server/db/db"

export async function POST ({request}) {
    const formDataId = await request.formData()
    const id = await formDataId.get('id')?.valueOf()
    const newState = await formDataId.get('newState')?.valueOf()
    const newDate = await formDataId.get('newDate')?.valueOf()
    const job = await formDataId.get('job')?.valueOf()
    
    // prendo i dati dell'API dell' utente corrente dal db
    const userDB = await getUser(id)
    // setto il form
    const formData = new FormData();
    // API 
    formData.set('user', userDB.userAPI)
    formData.set('password', userDB.passAPI)
    // DATI
    formData.set('job', job)
    formData.set('nuovoStato', newState)
    formData.set('data', newDate)

    // invio la richiesta
    let res = await fetch('https://menumal.it/api/private/setStatoUser.php',{
        method: 'POST',
        body: formData
    })
    const response = await res.json()
    return json(response)
}