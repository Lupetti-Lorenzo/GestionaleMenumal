
<script>
///---------- PWA
import { onMount } from 'svelte'
import { pwaInfo } from 'virtual:pwa-info'

let ReloadPrompt
  
onMount(async () => {
    pwaInfo && (ReloadPrompt = (await import('$lib/components/reloadPrompt.svelte')).default)

    if (pwaInfo) {
        const { registerSW } = await import('virtual:pwa-register')
        registerSW({
        immediate: true,
        onRegistered(r) {
            // uncomment following code if you want check for updates
            // r && setInterval(() => {
            //    console.log('Checking for sw update')
            //    r.update()
            // }, 20000 /* 20s for testing purposes */)
            console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        }
        })
    }
    })

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
    //--------------//


    import { authUser } from "$lib/client/auth"
    
    import  Nav  from "$lib/components/layout/nav.svelte"

    $: user = $authUser
    $: logged = user != undefined

</script>

<svelte:head>
    {@html webManifest}

    <style>
        body {
            padding: 10px;
        }
    </style>
</svelte:head>

<Nav />
<!-- {#if logged}
    <p>userID: {user.id}</p>
    <p>mail: {user.email}</p>
{/if} -->

{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}

<slot></slot>