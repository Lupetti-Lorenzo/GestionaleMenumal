import { authUser } from "./authStore"
import { online } from "./onlineStore"

import { get } from "svelte/store"
import { writable } from "svelte/store"

async function getNewToken() {
	// non loggato o offline non faccio chiamata
	if (get(authUser) == null || !get(online)) return ""
	console.log()
	const formData = new FormData()
	formData.set("uid", get(authUser).id)
	const res = await fetch("api/createTokenMenumal", {
		method: "POST",
		body: formData
	})
	const token = await res.json()
	console.log(token)
	return token
}

const createTokenStore = () => {
	const { subscribe, set } = writable("")
	// si setta e ogni quarto d'ora refresha il token
	const startInterval = () => {
		getNewToken().then((token) => set(token))
		setInterval(() => {
			getNewToken().then((token) => set(token))
		}, 890000)
	}

	return {
		subscribe,
		startInterval
	}
}

export const token = createTokenStore()

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
