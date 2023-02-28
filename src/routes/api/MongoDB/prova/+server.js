import { dbConnect } from "$lib/server/db.js"

export const POST = (async () => {
    await dbConnect()
    

    //console.log(client)

    return new Response('', {success:true});
})