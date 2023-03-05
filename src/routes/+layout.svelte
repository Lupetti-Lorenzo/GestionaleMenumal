<svelte:head>
    <style>
        body {
            padding: 10px;
        }
    </style>
</svelte:head>

<script>
    import { authUser } from "$lib/client/auth"
    
    import  Nav  from "$lib/components/layout/nav.svelte"

    $: user = $authUser
    $: logged = user != undefined

</script>

<Nav />
{#if logged}
    <p>userID: {user.id}</p>
    <p>mail: {user.email}</p>
{/if}

<slot></slot>