import { deserialize } from "$app/forms";



export const actions = {
    creaTokenBackDoor: async ({request}) => {
        // get token from request form
        const formData = await request.formData();
        formData.set('user', "l.lupetti")
        formData.set('password', "12345678")
        // i dati vanno presi dal db, saranno nel documento dell'utente
        let res = await fetch('https://menumal.it/api/createToken.php',{
            method: 'POST',
            body: formData
        })
        const token = deserialize(await res.text());
        return { token }
    },
}