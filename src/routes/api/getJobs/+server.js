import { UserModel } from "$lib/server/db/models/User.js"
import { json } from "@sveltejs/kit"


export async function POST ({request}) {
        const formDataId = await request.formData()
        const id = await formDataId.get('uid')?.valueOf()
        let dbRes = await UserModel.find({uidFireBase: JSON.parse(id)})
        let userDB = JSON.parse(JSON.stringify(dbRes))[0]
        // setto il form con user e pass API
        const formData = new FormData();
        formData.set('user', userDB.userAPI)
        formData.set('password', userDB.passAPI)
        let res = await fetch('https://menumal.it/api/private/getJobs.php',{
            method: 'POST',
            body: formData
        })
        const jobs = await res.json()
        return json(jobs)
}