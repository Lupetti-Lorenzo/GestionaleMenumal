import { browser } from "$app/environment"
import { writable, get } from "svelte/store"

import { notificationStore } from "./notificationStore"
import { jobsStore } from "./jobsStore"
import { loaderStore } from "./globalLoaderStore"

const createOfflineStore = () => {
	const store = writable({
		requestsPending: [], // array di richieste nella forma - path,
		jobsOptimisticUI: [] // array con le modifiche fatte offline, da rifare quando refresho o riapro l'app
	})
	const { subscribe, update } = store

	const syncStorage = () => {
		if (browser) {
			// se non e settato lo metto a [] - lo store è gia inizializzato a []
			if (!localStorage.requestsPending) {
				localStorage.requestsPending = JSON.stringify([])
			} else {
				// altrimenti prendo il valore dallo store e aggiorno lo store
				const requestsPending = JSON.parse(localStorage.requestsPending)
				update((store) => {
					return { ...store, requestsPending }
				})
			}

			// mi sincronizzo anche con jobsOptimisticUI
			if (!localStorage.jobsOptimisticUI) {
				// se non ce inizializzo a []
				localStorage.jobsOptimisticUI = JSON.stringify([])
				// store è gia a []
			} else {
				// prendo il valore dallo store e aggiorno lo store
				const jobsOptimisticUI = JSON.parse(localStorage.jobsOptimisticUI)
				update((store) => {
					return { ...store, jobsOptimisticUI }
				})
			}
		} else console.log("not online")
	}

	// aggiungi una richiesta all'array
	const addRequest = (request) => {
		update((store) => {
			store.requestsPending.push(request)
			return store
		})
	}

	// eseguo le richieste in pending, attivata quando ritorno online - esegue le richieste e ripulisce il local storage
	const executeRequestsPending = async () => {
		loaderStore.showLoader() // loader globale per far sapere all'utente che sta sincronizzando
		//chiamate non andate con successo
		const requestRemaining = []
		const indexes = [] // indici delle modifiche da eliminare dal local storage
		// per ogni richiesta faccio la fetch
		// se esiste la logout, la faccio per prima

		for (const request of get(store).requestsPending) {
			const formData = new FormData()
			for (const [key, value] of Object.entries(request?.body)) formData.set(key, value)
			try {
				const res = await fetch(request.url, {
					method: request.method,
					body: formData
				})
				// console.log(request.url)
				// if (request.url === "/logout") continue
				const response = await res.json()
				// notifico l'utente solo se ci sono stati degli errori
				if (response.error) notificationStore.addNotification(response.message, "error")
				// per ogni richiesta che non da errore rimuovo anche dal localstorage e aggiorno pure l'array
				const jobsOptimisticUI = JSON.parse(localStorage.jobsOptimisticUI) || []
				const index = jobsOptimisticUI.findIndex(
					(job) =>
						job.job == request.body.job &&
						job.newDate == request.body.newDate &&
						job.newState == request.body.newState
				)

				if (index > -1) {
					// aggiorno local storage
					jobsOptimisticUI.splice(index, 1)
					localStorage.jobsOptimisticUI = JSON.stringify(jobsOptimisticUI)
					// rimuovo anche dallo store
					update((store) => {
						return { ...store, jobsOptimisticUI: jobsOptimisticUI.splice(index, 1) }
					})
				}
			} catch (err) {
				// se errore o non connessione la rimetto tra le pending - non bene, se da errore lo ridara molto probabilmente, meglio mandare notifica
				console.log("errore fetch pending request")
				notificationStore.addNotification(err, "error")
				//requestRemaining.push(request)
			}
		}

		// schedulo l'update della tabella tra 1 secondo - do il tempo ad airtable di sincronizzare i dati e a me di tornare online per non usare i dati nella cache
		setTimeout(async () => {
			await jobsStore.updateJobs(false)
			loaderStore.closeLoader() // dopo updatejobs l'interfaccia è aggiornata e chiudo il loader
			// mando notifica di sincronizzazione
			if ("Notification" in window && window.Notification.permission === "granted") {
				new window.Notification("Modifiche offline eseguite", {
					lang: "it",
					body: "Sei ritornato online e ti sei sincronizzato con successo!",
					icon: "./icon192.png",
					vibrate: [200, 100, 200]
				})
			}
		}, 1000)
		// dopo l'update viene automaticamente refreshata la tabella, se non ci sono stati errori il refresh non avra nessun cambiamento, dato che la optimistic ui ha gia cambiato tutto come in successo
		// inizializzo le richieste dello store
		update((store) => {
			return { ...store, requestsPending: requestRemaining }
		})

		return indexes
	}

	// renderizzo i jobs non sincronizzati quando sono offline
	const renderOptimisticUI = () => {
		update((store) => {
			for (const job of store.jobsOptimisticUI) {
				jobsStore.updateJobState(job.job, job.newState, job.newDate)
			}
			return { ...store, jobsOptimisticUI: [] }
		})
	}

	return {
		subscribe,
		addRequest,
		executeRequestsPending,
		syncStorage,
		renderOptimisticUI
	}
}

export const offlineMenager = createOfflineStore()
