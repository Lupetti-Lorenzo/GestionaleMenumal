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
		// chiamo la api/getJobs
		const res = await fetch("api/getJobs")

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

	const updateJobState = (jobName, newState, newDate) => {
		update((store) => {
			// calcolo il nuovo job
			const newJob = { ...store.jobs.find((job) => job.fields["Opportunity name"] === jobName) }
			newJob.fields["dataScadenza"] = newDate
			newJob.fields["StatoDB"] = newState
			console.log("newJob: " + newJob.fields["statoDB"])
			console.log("newJob: " + JSON.stringify(newJob))
			// calcolo i jobs aggiornati - il job deve essere in un altra posizione, altrimenti la ui rembra che non sia cambiato nulla, lo metto in cima
			const newJobs = [
				newJob,
				...store.jobs.filter((job) => job.fields["Opportunity name"] !== jobName)
			]
			const newFilteredJobs = [
				newJob,
				...store.filteredJobs.filter((job) => job.fields["Opportunity name"] !== jobName)
			]
			// const newJobs = store.jobs.map((job) => job.fields["Opportunity name"] !== jobName ? job: newJob)
			// const newFilteredJobs = store.filteredJobs.map((job) => job.fields["Opportunity name"] !== jobName ? job: newJob)

			// aggiorno lo store
			return { ...store, jobs: [...newJobs], filteredJobs: [...newFilteredJobs] }
		})
	}

	return {
		subscribe,
		set,
		updateJobs,
		updateJobState
	}
}

export const jobsStore = createJobsStore()

export const searchHandler = (store) => {
	if (store.search == "") {
		store.filteredJobs = store.jobs
		return
	}

	store.filteredJobs = store.jobs.filter((job) =>
		job.fields["Opportunity name"]?.toLowerCase().includes(store.search.toLowerCase())
	)
}
