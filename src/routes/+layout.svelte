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

    $: uid = $authUser

</script>

<Nav />

<p>userID: {uid}</p>
<slot></slot>