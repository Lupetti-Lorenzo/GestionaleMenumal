<script>
	import { goto } from "$app/navigation"
	import { invalidateAll } from "$app/navigation"
	import { get } from "svelte/store"

	import LoadingButton from "../loadingButton.svelte"
	import { online } from "$lib/client/onlineStore"
	import { offlineMenager } from "$lib/client/offlineMenagerStore"
	import { notificationStore } from "$lib/client/notificationStore"
	//import { authUser } from "$lib/client/authStore"

	export let logged
	export let email

	let loading = false

	const logout = async () => {
		loading = true
		// se sono offline metto la richiesta in pending e vado nella login
		if (!get(online)) {
			// vado alla login
			goto("/login")
			// setto user a null
			offlineMenager.setClientLogout(true)
			// mostro notifica
			notificationStore.addNotification(`Logout effettuato con successo!`, "success")
		} else {
			await fetch("api/logout", { method: "POST" })
			await invalidateAll()
		}
		loading = false
	}
</script>

<nav class="flex row justify-start items-center w-full mb-4 p-2">
	<!-- <a href="/">Home</a> se sono in singin -->

	{#if logged}
		<!-- <a href="/signup" data-sveltekit-prefetch class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Registra nuovo utente</a>  -->
		<!-- bottone logout, se sono offline è disabilitato disabled={!$online} -->
		<span class="mr-2 mb-2"
			><LoadingButton text="LOGOUT" disabled={false} {loading} on:completeCalled={logout} /></span
		>
		<!-- <button
			type="button"
			class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
			on:click|preventDefault={logout}
			href="/login">LOGOUT</button
		> -->
		<p class="font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-gray-200 whitespace-nowrap">
			<b>Utente</b>: {email}
		</p>
	{/if}
</nav>
