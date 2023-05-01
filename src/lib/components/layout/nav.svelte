<script>
	import { invalidateAll } from "$app/navigation"

	import { authUser } from "$lib/client/authStore"
	
    $: logged = $authUser != null

	const logout = async () => {
		await fetch('/logout', { method: 'POST' })
		await invalidateAll()
	}
</script>

<nav class="flex row justify-start items-center w-full mb-4">
    <!-- <a href="/">Home</a>
	<a href="/login" data-sveltekit-prefetch>login</a>  -->
	{#if logged}	
		<!-- <a href="/signup" data-sveltekit-prefetch class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Registra nuovo utente</a>  -->
		<button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2" on:click|preventDefault={logout} href='/login'>LOGOUT</button> 
		<p class="font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-gray-200"><b>Utente</b>: {$authUser.email}</p>
	{/if}
	<!-- con il flag data-sveltekit-prefetch fa il prefetch quando l'utente fa hover sul link -->
</nav>