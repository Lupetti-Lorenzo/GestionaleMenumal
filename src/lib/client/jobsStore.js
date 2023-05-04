import { writable } from "svelte/store"
import { transformDate, parseDateFromSlash } from "$lib/client/utility/dateFormatter"

const createJobsStore = () => {
	const { subscribe, set, update } = writable({
		jobs: [],
		orderedJobs: [],
		filteredJobs: [],
		search: "",
		loading: false
	})

	const updateJobs = async (loading = true) => {
		// prima resetto tutto per mostrare il loader e disabilitare la input
		update((old) => {
			if (loading) {
				return {
					jobs: [],
					orderedJobs: [],
					filteredJobs: [],
					search: "",
					loading
				}
			}
			return {
				// loading false -  mantengo i dati per non far decomparire la ui
				...old,
				loading
			}
		})
		//set({ jobs: [], orderedJobs: [], filteredJobs: [], search: "", loading: true })
		// chiamo la api/getJobs
		const res = await fetch("api/getJobs", {
			method: "POST"
		})
		const jobs = await res.json()
		// dopo la chiamata all'api aggiorno lo store
		// prima parso per aggiungere campi utili e gia computati
		const parsedJobs = jobs?.map((job) => {
			// parso il job per agevolare i componenti
			const newJob = { ...job }
			newJob.fields["dataRegistrazioneIT"] = transformDate(newJob.fields["Data registrazione"])
			newJob.fields["dataScadenza"] = parseDateFromSlash(newJob.fields["Data scadenza"])
			return newJob
		})
		update((oldStore) => {
			return {
				...oldStore,
				jobs: parsedJobs,
				loading: false
			}
		})
	}

	return {
		subscribe,
		set,
		updateJobs
	}
}

export const jobsStore = createJobsStore()

export const searchHandler = (store) => {
	if (store.search == "") {
		store.filteredJobs = []
		return
	}

	store.filteredJobs = store.jobs.filter((job) =>
		job.fields["Opportunity name"]?.toLowerCase().includes(store.search.toLowerCase())
	)
}
