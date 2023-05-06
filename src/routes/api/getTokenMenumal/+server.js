import { json } from "@sveltejs/kit"
import { getUser } from "$lib/server/db/db"

export async function GET({ locals }) {
	const id = locals.user
	// prendo i dati dell'API dello user corrente dal db
	const userDB = await getUser(id)
	// setto il form con user e pass API
	const formData = new FormData()
	formData.set("user", userDB.userAPI)
	formData.set("password", userDB.passAPI)
	// invio la richiesta del token
	let res = await fetch("https://menumal.it/api/private/createToken.php", {
		method: "POST",
		body: formData
	})
	const token = await res.json()
	return json(token)
	// const text = await res.text()
	// //console.log(text)
	// try {
	// 	return json(JSON.parse(text))
	// 	// const token = await res.json()
	// } catch (err) {
	// 	return json(JSON.parse(err))
	// }
}
