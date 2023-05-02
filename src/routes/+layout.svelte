<script>
	//tailwind css
	import "../app.css"

	import Nav from "$lib/components/layout/nav.svelte"
	import Notification from "$lib/components/layout/notification.svelte"
</script>

<Notification />
<Nav />

<slot />
