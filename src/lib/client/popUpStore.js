import { writable } from "svelte/store";

const createPopUpsStore = () => {
	const { subscribe, set, update } = writable({
		statoDb: 5, // uno stato non valido
        jobName: "",
        registerDate: "",
        whichPopUp: "",
        open: false
	});

	return {
		subscribe,
		set,
		update
	};
}

export const popUpStore = createPopUpsStore()