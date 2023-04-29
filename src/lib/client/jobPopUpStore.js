import { writable } from "svelte/store";

const createPopUpsStore = () => {
	const { subscribe, set } = writable({
		data: {},
		// dbState: 5, // uno stato non valido
        // jobName: "",
        // registerDate: "",
        whichPopUp: "",
        open: false
	});

	const showPopUp = (whichPopUp, data) => {
		set({open: true, data, whichPopUp})
	}

	const closePopUp = () => {
		set({open: false, data:{}, whichPopUp: ""})
	}

	return {
		subscribe,
		closePopUp,
		showPopUp
	};
}

export const popUpStore = createPopUpsStore()