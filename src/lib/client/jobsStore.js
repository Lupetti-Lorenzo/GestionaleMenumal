import { writable } from "svelte/store"; 

const createJobsStore = () => {
	const { subscribe, set, update } = writable({
		jobs: [],
		orderedJobs: [],
		filteredJobs: [],
		search: "",
		loading: false
	});

	const updateJobs = async () => {
		// prima resetto tutto per mostrare il loader e disabilitare la input
		set({jobs: [], orderedJobs: [], filteredJobs: [], search: "", loading: true})
		// chiamo la api/getJobs
        const res = await fetch("api/getJobs", {
            method: 'POST',
        });
        const jobs = await res.json()
		// dopo la chiamata all'api aggiorno lo store
		// prima parso per aggiungere campi utili e gia computati 
		const parsedJobs = jobs.map(job => { // parso il job per agevolare i componenti
			const newJob = {...job}
			newJob.fields['dataRegistrazioneIT'] = transformDate(newJob.fields['Data registrazione'])
			return newJob
		})
		update((oldStore) => {return {...oldStore, jobs: parsedJobs, orderedJobs: getOrderedJobs(parsedJobs), loading: false}})
	}

	return {
		subscribe,
		set,
		updateJobs
	};
}

const getOrderedJobs = (jobs) => {
	return jobs.filter(job => job.fields['dataRegistrazioneIT']).sort((job1, job2) => {
		// ho gia filtrato quelli che non hanno entrambi i campi, con l'if faccio la preferenza su dataRegistrazione
		const dataRegistrazione1 = job1.fields['dataRegistrazioneIT']
		const dataRegistrazione2 = job2.fields['dataRegistrazioneIT']
		///const dataRegistrazione2 = job.fields['dataRegistrazione'] === undefined ? job.fields['Data registrazione'].replace() : job.fields['dataRegistrazione']
		job1 = dataRegistrazione1.split('-').reverse().join('');
		job2 = dataRegistrazione2.split('-').reverse().join('');
		return job1 > job2 ? 1 : job1 < job2 ? -1 : 0;
	})
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