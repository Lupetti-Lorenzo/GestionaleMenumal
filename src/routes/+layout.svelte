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

	// controllo per refreshare quando user non autenticato e non sono in login
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
