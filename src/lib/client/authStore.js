import { page } from "$app/stores"
import { derived } from "svelte/store"
import { offlineMenager } from "$lib/client/offlineMenagerStore"

export const authUser = derived(
	[page, offlineMenager],
	($values, set) => {
		// se faccio logout da offline setto questa variabile per  "simulare" il non loggato
		if ($values[1].clientLogout) {
			set(null)
			return
		}
		const user = $values[0].data.user
		if (!user) {
			set(null)
			return
		}
		set(user)
	},
	null
)
