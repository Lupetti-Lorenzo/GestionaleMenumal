<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";
    import MenuSwitch from "$lib/components/menuSwitch.svelte";
    import StatisticsTable from "../lib/components/statisticsView.svelte";

    import { authUser } from "../lib/client/authStore";

    import { invalidateAll } from "$app/navigation"

    import { jobsStore, searchHandler } from "$lib/client/jobsStore.js"
    import { onMount } from "svelte";
    
    // richiedo i jobs dall'api di airtable e li salvo in jobsStore, da cui viene creata la tabella e abilitata la funzionalita di ricerca
    onMount(jobsStore.updateJobs)
    
    // utilizzo questa sintassi per iscrivere un il search handler ogni volta che cambia jobStore
    $: searchHandler($jobsStore)
    
    // controllo per refreshare quando user non autenticato, a volte non passa dalla load e non mostra la navbar
    $: $authUser, async () => {$authUser == null ? await invalidateAll() : ""};

    let menuSelection // variabile per cambiare la dashboard dopo aver cliccato in menuswitch


</script>

<!-- DASHBOARD -->

<div id="" class="w-full">
    <div class="flex items-center flex-col justify-center font-sans">
        <MenuSwitch bind:menuSelection/>
        {#if menuSelection === "table"}
            <JobsTable/>
        {:else if menuSelection === "stats"}
            <StatisticsTable/>
        {/if}
    </div>
</div>
