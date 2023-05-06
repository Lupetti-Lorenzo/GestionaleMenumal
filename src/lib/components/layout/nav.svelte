<script>
	import { invalidateAll } from "$app/navigation"
	import LoadingButton from "../loadingButton.svelte"

	export let logged
	export let email

	let loading = false

	const logout = async () => {
		loading = true
		await fetch("/logout", { method: "POST" })
		await invalidateAll()
		loading = false
	}
</script>

<nav class="flex row justify-start items-center w-screen mb-4 p-2">
	<!-- <a href="/">Home</a>
	<a href="/login" data-sveltekit-prefetch>login</a>  -->
	{#if logged}
		<!-- <a href="/signup" data-sveltekit-prefetch class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Registra nuovo utente</a>  -->

		<span class="mr-2 mb-2"
			><LoadingButton text="LOGOUT" {loading} on:completeCalled={logout} /></span
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
