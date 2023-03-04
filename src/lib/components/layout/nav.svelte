<script>
	import { getFirebase  } from "$lib/client/firebase"
	import { invalidateAll } from "$app/navigation"
	import { signOut } from "firebase/auth"

	const { auth } = getFirebase()

	import { authUser } from "$lib/client/auth"

    $: logged =  JSON.stringify($authUser) !== '{}'

	const logout = async () => {
		await signOut(auth)
		await fetch('/logout', { method: 'POST' })
		await invalidateAll()
	}
</script>

<nav>
    <a href="/">Home</a>
	<a href="/signup" data-sveltekit-prefetch>signup</a> 
	<a href="/login" data-sveltekit-prefetch>login</a> 
	{#if logged}	
		<button on:click|preventDefault={logout} href='/login'>LOGOUT</button> 
	{/if}
	<!-- con il flag data-sveltekit-prefetch fa il prefetch quando l'utente fa hover sul link -->
</nav>

<style>
	nav {
		display: flex;
	}
	nav a {
		margin-right: 1rem;
	}
</style>