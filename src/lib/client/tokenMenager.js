import { authUser } from "./authStore"
import { get } from "svelte/store"
import { readable } from "svelte/store"

async function getNewToken() {
	if (get(authUser) == null) return ""
	// const formData = new FormData()
	// formData.set("uid", get(authUser).id)
	const res = await fetch("api/getTokenMenumal")
	const token = await res.json()
	return token
}

// readable store che contiene il token di comunicazione con l'API di menumal, il token dura mezz'ora
// dopo averlo inizialmente settato, avvio un timer che ogni mezz'ora lo aggiorna con uno nuovo
export const token = readable("", function start(set) {
	getNewToken().then((token) => set(token))
	const interval = setInterval(() => {
		getNewToken().then((token) => set(token))
		// }, 10000)
	}, 890000) // ogni quarto d'ora refresha il token
	return () => clearInterval(interval)
})
