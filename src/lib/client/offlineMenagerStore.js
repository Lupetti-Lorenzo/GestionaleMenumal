import { browser } from "$app/environment"
import { writable, get } from "svelte/store"

import { notificationStore } from "./notificationStore"
import { jobsStore } from "./jobsStore"
import { loaderStore } from "./globalLoaderStore"

const createOfflineStore = () => {
	const store = writable({
		requestsPending: [] // array di richieste nella forma - path
	})
	const { subscribe, update, set } = store

	const syncStorage = () => {
		if (browser) {
			// se non e settato lo metto a [] - lo store è gia inizializzato a []
			if (!localStorage.requestsPending) {
				localStorage.requestsPending = JSON.stringify([])
				return
			}
			// altrimenti prendo il valore dallo store e aggiorno lo store
			const requestsPending = JSON.parse(localStorage.requestsPending)
			set({ requestsPending })
		}
	}

	// aggiungi una richiesta all'array
	const addRequest = (request) => {
		update((store) => {
			store.requestsPending.push(request)
			return store
		})
	}

	const executeRequestsPending = async () => {
		loaderStore.showLoader() // loader globale per far sapere all'utente che sta sincronizzando
		//chiamate non andate con successo
		const requestRemaining = []
		console.log("there")
		// per ogni richiesta faccio la fetch
		for (const request of get(store).requestsPending) {
			const formData = new FormData()
			for (const [key, value] of Object.entries(request.body)) formData.set(key, value)
			// console.log(`fetch ${request.method} ${request.url} `)
			try {
				const res = await fetch(request.url, {
					method: request.method,
					body: formData
				})
				const response = await res.json()
				// notifico l'utente solo se ci sono stati degli errori
				if (response.error) notificationStore.showNotification(response.message, "error")
			} catch (err) {
				// se errore o non connessione la rimetto tra le pending
				requestRemaining.push(request)
			}
		}
		// schedulo l'update della tabella tra 1 secondo - do il tempo ad airtable di sincronizzare i dati e a me di tornare online per non usare i dati nella cache
		setTimeout(async () => {
			await jobsStore.updateJobs(false)
			loaderStore.closeLoader() // dopo updatejobs l'interfaccia è aggiornata e chiudo il loader
		}, 1000)
		// dopo l'update viene automaticamente refreshata la tabella, se non ci sono stati errori il refresh non avra nessun cambiamento, dato che la optimistic ui ha gia cambiato tutto come in successo
		// inizializzo lo store
		set({ requestsPending: requestRemaining })
	}

	return {
		subscribe,
		addRequest,
		executeRequestsPending,
		syncStorage
	}
}

export const offlineMenager = createOfflineStore()
