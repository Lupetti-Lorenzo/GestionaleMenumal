<script>
	import { goto } from "$app/navigation"
	import { invalidateAll } from "$app/navigation"
	// import { get } from "svelte/store"

	import LoadingButton from "../loadingButton.svelte"
	import { online } from "$lib/client/onlineStore"
	// import { offlineMenager } from "$lib/client/offlineMenagerStore"

	export let logged
	export let email

	let loading = false

	const logout = async () => {
		loading = true
		// se sono offline metto la richiesta in pending e vado nella login
		// if (!get(online)) {
		// 	// aggiungo la richiesta alle pending
		// 	offlineMenager.addRequest({
		// 		url: "/logout",
		// 		method: "POST",
		// 		body: {}
		// 	})
		// 	// vado alla login
		// 	//goto("/login")
		// 	// settare auth user a null
		// } else {
		await fetch("/logout", { method: "POST" })
		await invalidateAll()
		// }
		loading = false
	}
</script>

<nav class="flex row justify-start items-center w-full mb-4 p-2">
	<!-- <a href="/">Home</a> se sono in singin -->

	{#if logged}
		<!-- <a href="/signup" data-sveltekit-prefetch class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Registra nuovo utente</a>  -->
		<!-- bottone logout, se sono offline è disabilitato -->
		<span class="mr-2 mb-2"
			><LoadingButton
				disabled={!$online}
				text="LOGOUT"
				{loading}
				on:completeCalled={logout}
			/></span
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
