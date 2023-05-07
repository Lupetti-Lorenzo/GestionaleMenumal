import { writable } from "svelte/store"

const createPopUpsStore = () => {
	const { subscribe, set } = writable({
		data: {},
		// dbState: 5, // uno stato non valido
		// jobName: "",
		// registerDate: "",
		// expireDate:
		open: false
	})

	const showPopUp = (data) => {
		set({ open: true, data })
	}

	const closePopUp = () => {
		set({ open: false, data: {} })
	}

	return {
		subscribe,
		closePopUp,
		showPopUp
	}
}

export const popUpStore = createPopUpsStore()
