<script>
	//tailwind css
	import "../app.css"

	import Nav from "$lib/components/layout/nav.svelte"
	import ToastNotification from "$lib/components/layout/toastNotification.svelte"
	import OfflineIcon from "$lib/components/layout/offlineIcon.svelte"
	import GlobalLoader from "$lib/components/layout/globalLoader.svelte"

	import { online } from "$lib/client/onlineStore"
	import { authUser } from "$lib/client/authStore"
	import { offlineMenager } from "$lib/client/offlineMenagerStore"

	import { page } from "$app/stores"
	import { invalidateAll } from "$app/navigation"
	import { onMount } from "svelte"

	onMount(async () => {
		// mi sincronizzo con i dati offline nel local storage
		offlineMenager.syncStorage()
		// sincronizzo lo store con il local storage
		offlineMenager.subscribe((store) => {
			localStorage.clientLogout = store.clientLogout
		})
	})
	// se sono online e ci sono delle pending requests, le eseguo
	$: if (
		$authUser &&
		$online &&
		$offlineMenager.requestsPending.length !== 0 &&
		$offlineMenager.clientLogout === "no"
	) {
		offlineMenager.executeRequestsPending()
	}
	// controllo per refreshare quando user non autenticato e non sono in login - se faccio logout col client non mi interessa
	$: if (!$authUser && $page.url.pathname !== "/login" && $offlineMenager.clientLogout === "no") {
		console.log("$authUser == null e non in login")
		invalidateAll()
	}

	// per offline - appena ritorno online dopo un logout da offline faccio la fetch /logout
	$: if ($offlineMenager.clientLogout === "yes" && $online) {
		fetch("api/logout", { method: "POST" }).then(async () => {
			await invalidateAll()
			offlineMenager.setClientLogout("no")
		})
	}
</script>

<!-- Bindo lo stato della connessione del client ad uno store accedibile da ogni componente, per modificare l'interfaccia di conseguenza -->
<svelte:window bind:online={$online} />
<!-- Notifica fixed in alto a destra -->
<ToastNotification />
<!-- Loader fixed in alto a destra per operazioni in background -->
<GlobalLoader />
<!-- Se sono offline infondo alla navbar metto un icona di offline -->
<OfflineIcon />

<Nav logged={$authUser != null} email={$authUser?.email} />

<slot />
