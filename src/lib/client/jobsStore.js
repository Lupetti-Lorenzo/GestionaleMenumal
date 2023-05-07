import { writable } from "svelte/store"
import { transformDate, parseDateFromSlash } from "$lib/client/utility/dateFormatter"

const createJobsStore = () => {
	const { subscribe, set, update } = writable({
		jobs: [],
		filteredJobs: [],
		search: "",
		stateFilter: "",
		dateFilter: false,
		loading: false
	})

	const updateJobs = async (loading = true) => {
		// prima resetto tutto per mostrare il loader e disabilitare la input
		update((old) => {
			if (loading) {
				return {
					jobs: [],
					filteredJobs: [],
					search: "",
					stateFilter: "",
					dateFilter: false,
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

			const newJobs = [
				...store.jobs.map((job) => (job.fields["Opportunity name"] !== jobName ? job : newJob))
			]
			const newFilteredJobs = [
				...store.filteredJobs.map((job) =>
					job.fields["Opportunity name"] !== jobName ? job : newJob
				)
			]

			// aggiorno lo store
			return { ...store, jobs: newJobs, filteredJobs: newFilteredJobs }
		})
	}

	const toggleDateFilter = () => {
		update((store) => {
			return { ...store, dateFilter: !store.dateFilter }
		})
	}

	return {
		subscribe,
		set,
		updateJobs,
		updateJobState,
		toggleDateFilter
	}
}

export const jobsStore = createJobsStore()

export const searchHandler = (store) => {
	if (store.search == "") {
		store.filteredJobs = store.jobs
	} else {
		// filtro la ricerca
		store.filteredJobs = store.jobs.filter((job) =>
			job.fields["Opportunity name"]?.toLowerCase().includes(store.search.toLowerCase())
		)
	}

	// filtro per stato
	if (store.stateFilter !== "") {
		store.filteredJobs = store.filteredJobs.filter((job) =>
			job.fields["StatoDB"]?.toLowerCase().includes(store.search.toLowerCase())
		)
	}

	//ordino per datascadenza piu vicina a oggi se settata
	if (store.dateFilter) {
		store.filteredJobs = store.filteredJobs.sort((job1, job2) => {
			const dataScadenza1 = job1.fields["dataScadenza"]
			const dataScadenza2 = job2.fields["dataScadenza"]
			job1 = dataScadenza1.split("-").join("")
			job2 = dataScadenza2.split("-").join("")
			return job1 > job2 ? -1 : job1 < job2 ? 1 : 0
		})
	} else {
		// normalmente faccio vedere i jobs filtrati per data registrazione
		store.filteredJobs = store.filteredJobs.sort((job1, job2) => {
			const dataRegistrazione1 = job1.fields["dataRegistrazioneIT"]
			const dataRegistrazione2 = job2.fields["dataRegistrazioneIT"]
			job1 = dataRegistrazione1.split("-").reverse().join("")
			job2 = dataRegistrazione2.split("-").reverse().join("")
			return job1 > job2 ? -1 : job1 < job2 ? 1 : 0
		})
	}
}
