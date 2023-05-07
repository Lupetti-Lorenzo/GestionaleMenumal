import { json } from "@sveltejs/kit"
import { getUser } from "$lib/server/db/db"

export async function POST({ request }) {
	const formDataId = await request.formData()
	const id = await formDataId.get("uid")?.valueOf()
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
	try {
		const token = await res.json()
		return json(token)
	} catch (err) {
		const error = await res.text()
		return json(error)
	}
}
