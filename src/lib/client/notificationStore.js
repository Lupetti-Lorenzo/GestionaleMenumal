import { writable, get } from "svelte/store"

// Notification Store - gestisce la notifica che appare nella navbar, basta importarlo e chiamare showNotification con il messaggio e il tipo per far apparire la notifica
// Migliorie: parametrizzare la durata, opzione per  mettere x per chiudere
const createNotificationStore = () => {
	const store = writable({
		message: "",
		type: "",
		open: false,
		notifyQueue: []
	})
	const { subscribe, update, set } = store

	const addNotification = (message, type) => {
		// aggiungo la notifica
		update((oldStore) => {
			oldStore.notifyQueue.push({ message, type })
			return { ...oldStore, notifyQueue: oldStore.notifyQueue }
		})
		// se è ciuso, apro la notifica
		if (!get(store).open) {
			showNotification()
		}
	}

	const showNotification = () => {
		const notifyQueue = get(store).notifyQueue
		if (notifyQueue.length === 0) {
			// notifiche finite, chiudo
			set({ message: "", type: "", open: false, notifyQueue: [] })
			return
		}

		// prendo la notifica in testa all'array
		const newNotification = notifyQueue.shift()

		// setto la notifica e la nuova coda
		set({
			message: newNotification.message,
			type: newNotification.type,
			open: true,
			notifyQueue
		})

		// faccio partire un timeout di 4 secondi che chiama la prossima notifica
		setTimeout(function () {
			// next notifica
			showNotification()
		}, 4000)
	}

	return {
		subscribe,
		addNotification
	}
}

export const notificationStore = createNotificationStore()
