<script>
	//tailwind css
	import "../app.css"

	import Nav from "$lib/components/layout/nav.svelte"
	import Notification from "$lib/components/layout/notification.svelte"
	import OfflineIcon from "$lib/components/layout/offlineIcon.svelte"

	import { online } from "$lib/client/onlineStore"
</script>

<!-- Bindo lo stato della connessione del client ad uno store accedibile da ogni componente, per modificare l'interfaccia di conseguenza -->
<svelte:window bind:online={$online} />

<!-- Notifica fixed in alto a destra -->
<Notification />
<!-- Se sono offline infondo alla navbar metto un icona di offline -->
<OfflineIcon />

<Nav />

<slot />
