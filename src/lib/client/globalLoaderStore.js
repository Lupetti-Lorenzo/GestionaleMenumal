import { writable } from "svelte/store"

const createLoaderStore = () => {
	const { subscribe, update } = writable({
		loading: 0 // il numero di chiamate fatte
	})

	const showLoader = () => {
		update((loader) => {
			return { loading: loader.loading + 1 }
		})
	}

	const closeLoader = () => {
		update((loader) => {
			return { loading: loader.loading - 1 }
		})
	}

	return {
		subscribe,
		showLoader,
		closeLoader
	}
}

export const loaderStore = createLoaderStore()
