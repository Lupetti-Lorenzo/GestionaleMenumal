import { UserModel } from "$lib/server/db/models/User.js"

export const load = (async ({locals}) => {
    const fetchJobs = async () => {
        console.log("Locals user: "+locals.user)
        // prendo i dati dell'API dello user corrente dal db
        let dbRes = await UserModel.find({uidFireBase: JSON.parse(locals.user)})
        let userDB = JSON.parse(JSON.stringify(dbRes))[0]
        // setto il form con user e pass API
        const formData = new FormData();
        formData.set('user', userDB.userAPI)
        formData.set('password', userDB.passAPI)
        let res = await fetch('https://menumal.it/api/private/getJobs.php',{
            method: 'POST',
            body: formData
        })
        const jobs = res.json()
        return jobs
    } 
    
    return {
        jobs: fetchJobs()
    }
})