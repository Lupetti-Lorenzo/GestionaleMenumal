<script>
	//tailwind css
	import "../app.css"

	import Nav from "$lib/components/layout/nav.svelte"
	import Notification from "$lib/components/layout/notification.svelte"
	import OfflineIcon from "$lib/components/layout/offlineIcon.svelte"
	import GlobalLoader from "$lib/components/layout/globalLoader.svelte"

	import { online } from "$lib/client/onlineStore"
	import { authUser } from "$lib/client/authStore"
	import { offlineMenager } from "$lib/client/offlineMenagerStore"

	import { page } from "$app/stores"
	import { beforeUpdate } from "svelte"
	import { invalidateAll } from "$app/navigation"

	// se sono online e ci sono delle pending requests, le eseguo
	$: if ($authUser && $online && $offlineMenager.requestsPending.length !== 0)
		offlineMenager.executeRequestsPending()

	// $: if ($authUser && $online && $offlineMenager.requestsPending.length !== 0)

	// 	const jobsOptimisticUI = JSON.parse(localStorage.jobsOptimisticUI)
	// 			const index = jobsOptimisticUI.findIndex(
	// 				(job) =>
	// 					job.job === response.data.job &&
	// 					job.newDate === response.data.newDate &&
	// 					job.newState === response.data.newState
	// 			)
	// 			if (index > -1) {
	// 				indexes.push(index)
	// 				// only splice array when item is found
	// 				localStorage.jobsOptimisticUI = JSON.stringify(jobsOptimisticUI.splice(index, 1))
	// 				// rimuovo anche dallo store
	// 				update((store) => {
	// 					return { ...store, jobsOptimisticUI: jobsOptimisticUI.splice(index, 1) }
	// 				})
	// 			}

	// controllo per refreshare quando user non autenticato e non sono in login, a volte non passa dalla load e non mostra la navbar e non si attiva il tokenMenager properly
	beforeUpdate(async () => {
		// console.log("data: " + JSON.stringify(data))
		// console.log("$authUser " + JSON.stringify($authUser))
		if ($authUser == null && $page.url.pathname !== "/login") {
			console.log("$authUser == null e non in login")
			await invalidateAll()
		}
	})
</script>

<!-- Bindo lo stato della connessione del client ad uno store accedibile da ogni componente, per modificare l'interfaccia di conseguenza -->
<svelte:window bind:online={$online} />
<!-- Notifica fixed in alto a destra -->
<Notification />
<!-- Loader fixed in alto a destra per operazioni in background -->
<GlobalLoader />
<!-- Se sono offline infondo alla navbar metto un icona di offline -->
<OfflineIcon />

<Nav logged={$authUser != null} email={$authUser?.email} />

<slot />
