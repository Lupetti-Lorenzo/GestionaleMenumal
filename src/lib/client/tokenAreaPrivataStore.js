import { authUser } from "./authStore"
import { online } from "./onlineStore"

import { get } from "svelte/store"
import { writable } from "svelte/store"

async function getNewToken() {
	// non loggato o offline non faccio chiamata
	if (get(authUser) == null || !get(online)) return ""
	const formData = new FormData()
	formData.set("uid", get(authUser).id)
	const res = await fetch("api/createTokenMenumal", {
		method: "POST",
		body: formData
	})
	try {
		const token = await res.json()
		console.log("non error")
		return token
	} catch (err) {
		console.log("error: " + err)
		const error = await res.text()
		return JSON.parse(error)
	}
}

// readable store che contiene il token di comunicazione con l'API di menumal, il token dura mezz'ora
// dopo averlo inizialmente settato, avvio un timer che ogni mezz'ora lo aggiorna con uno nuovo
// export const token = readable("", function start(set) {
// 	getNewToken().then((token) => set(token))
// 	const interval = setInterval(() => {
// 		getNewToken().then((token) => set(token))
// 		// }, 10000)
// 	}, 890000) // ogni quarto d'ora refresha il token
// 	return () => clearInterval(interval)
// })

const createTokenStore = () => {
	const store = writable("")
	const { subscribe, set } = store

	const setToken = async () => {
		const token = await getNewToken()
		set(token)
		// dopo circa 15 minuti lo resetto
		setInterval(() => {
			set("")
		}, 890000)
	}

	return {
		subscribe,
		setToken
	}
}

export const token = createTokenStore()
