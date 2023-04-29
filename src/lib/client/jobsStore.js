import { writable } from "svelte/store"; 

const createJobsStore = () => {
	const { subscribe, set, update } = writable({
		jobs: [],
		filteredJobs: [],
		search: "",
		loading: false
	});

	const updateJobs = async () => {
		// prima resetto tutto per mostrare il loader e disabilitare la input
		set({jobs: [], filteredJobs: [], search: "", loading: true})
		// chiamo la api/getJobs
        const res = await fetch("api/getJobs", {
            method: 'POST',
        });
        const jobs = await res.json()
		// dopo la chiamata all'api aggiorno lo store
		const parsedJobs = jobs.map(job => { // parso il job per agevolare i componenti
			const newJob = {...job}
			newJob.fields['dataRegistrazioneIT'] = transformDate(newJob.fields['Data registrazione'])
			return newJob
		})
		update((oldStore) => {return {...oldStore, jobs: parsedJobs, loading: false}})
	}

	return {
		subscribe,
		set,
		updateJobs
	};
}

// funzione che trasforma la data dal formato US yyyy-mm-dd a un formato piu leggibile in italiano dd-mm-yyyy
function transformDate(dateString) {
	if (!dateString) return ""
	const parts = dateString.split('-');
	const year = parts[0];
	const month = parts[1];
	const day = parts[2];
	return `${day}-${month}-${year}`;
  }

export const jobsStore = createJobsStore()

export const searchHandler = (store) => {
	if (store.search == "") {store.filteredJobs = []; return}
	store.filteredJobs = store.jobs.filter((job) => job.fields['Opportunity name']?.toLowerCase().includes(store.search.toLowerCase()))
}