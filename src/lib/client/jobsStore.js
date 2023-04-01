import { writable } from "svelte/store"; 

export const createJobsStore = (jobs) => {
	const { subscribe, set, update } = writable({
		jobs,
		filteredJobs: jobs,
		search: ""
	});

	return {
		subscribe,
		set,
		update
	};
}

export const searchHandler = () => {
	//store.filteredJobs = store.jobs.filter((job) => job.fields['Opportunity name'].toLowerCase().includes(store.search.toLowerCase()))
}