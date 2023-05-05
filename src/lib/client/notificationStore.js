import { writable } from "svelte/store"

// Notification Store - gestisce la notifica che appare nella navbar, basta importarlo e chiamare showNotification con il messaggio e il tipo per far apparire la notifica
// Migliorie: parametrizzare la durata, opzione per  mettere x per chiudere
const createNotificationStore = () => {
	const { subscribe, update, set } = writable({
		message: "",
		type: "",
		open: false,
		prevTimeoutId: null
	})

	const showNotification = (message, type) => {
		//
		update((store) => {
			// se ce una notifica in corso interrompo il timeout
			if (store.prevTimeoutId) {
				clearTimeout(store.prevTimeoutId)
			}

			// faccio partire un timeout di 4 secondi che chiude il messaggio settando lo store
			const newTimeoutId = setTimeout(function () {
				set({ message: "", type: "", open: false, prevTimeoutId: null })
			}, 4000)

			return { message, type, open: true, prevTimeoutId: newTimeoutId }
		})
	}

	return {
		subscribe,
		showNotification
	}
}

export const notificationStore = createNotificationStore()
