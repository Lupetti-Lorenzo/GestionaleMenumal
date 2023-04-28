<script>
    import { notificationStore } from "$lib/client/notificationStore"
    $: type = $notificationStore.type
</script>

{#if $notificationStore.open}
    {#if type === "success"}
        <p class="font-medium rounded-lg text-sm  px-5 py-2.5 mr-2 mb-2 bg-teal-100 border-teal-500 shadow-md">{$notificationStore.message}</p>
    {:else if type === "error"} 
        <p class="font-medium rounded-lg text-sm  px-5 py-2.5 mr-2 mb-2 bg-red-100 border border-red-400 text-red-700 shadow-md">{$notificationStore.message}</p>
    {/if}
{/if}

<style>
    p {
        transition: ease-in;
        transition-duration: 8000;
    }
</style>