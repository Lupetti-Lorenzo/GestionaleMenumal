import { writable } from "svelte/store"; 

const createJobsStore = () => {
	const { subscribe, set, update } = writable({
		jobs: [],
		filteredJobs: [],
		search: ""
	});

	const updateJobs = async () => {
		// prima resetto tutto per mostrare il loader e disabilitare la input
		set({jobs: [], filteredJobs: [], search: ""})
        const res = await fetch("api/getJobs", {
            method: 'POST',
        });
        const jobs = await res.json()
		// dopo la chiamata all'api aggiorno lo store
		update((oldStore) => {return {...oldStore, jobs}})
	}

	return {
		subscribe,
		set,
		updateJobs
	};
}

export const jobsStore = createJobsStore()

export const searchHandler = (store) => {
	if (store.search == "") {store.filteredJobs = []; return}
	store.filteredJobs = store.jobs.filter((job) => job.fields['Opportunity name']?.toLowerCase().includes(store.search.toLowerCase()))
}