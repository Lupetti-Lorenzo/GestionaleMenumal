<script>
    import JobItem from "./jobItem.svelte";
    import JobPopUp from "./jobPopUp.svelte";

    import { jobsStore, searchHandler } from "$lib/client/jobsStore.js"
    import { onMount } from "svelte";
    
    // richiedo i jobs dall'api di airtable e li salvo in jobsStore, da cui viene creata la tabella e abilitata la funzionalita di ricerca
    onMount(async () => {
        jobsStore.updateJobs()
    })

    // utilizzo questa sintassi per iscrivere un il search handler ogni volta che cambia jobStore
    $: searchHandler($jobsStore)

    $: loadingJobs = $jobsStore.jobs.length === 0

</script>

<!-- Popup specializzato per le azioni in questa tabella-->
<JobPopUp />

<div id="jobsTable" class="w-full">
    <div class="flex items-start justify-center font-sans overflow-hidden">
        <div>
            <div class="{loadingJobs ? "animate-pulse": ""} bg-white shadow-md my-6">
                <!-- SEARCH FIELD -->
                <input disabled={loadingJobs} class="rounded-t focus-within:shadow-lg min-w-max w-full px-6 py-3  {loadingJobs ? "bg-gray-300": "bg-gray-200"} text-gray-600 text-sm leading-normal" type="search" placeholder={loadingJobs ? "Caricamento...": "Search..."} bind:value={$jobsStore.search}/>
                <!-- TABLE OF JOBS -->
                <table class="min-w-max w-full table-auto">
                    <thead>
                        <tr class="{loadingJobs ? "bg-gray-300": "bg-gray-200"} text-gray-600 uppercase text-sm leading-normal">
                            <th scope="col" class="px-6 py-3">
                                Nome Locale
                            </th>
                            <th scope="col" class="px-6 py-3">
                                <span class="sr-only">Area Privata</span>
                            </th>
                            <th scope="col" class="px-6 py-3">
                                <span class="sr-only">Cambia stato</span>
                            </th>
                            <th scope="col" class="px-6 py-3">
                                <span class="sr-only">Estendi free trial</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        <!-- Mostro i jobs filitrati, inizialmente 0 quindi la tabella risulta chiusa -->
                        {#if !loadingJobs}
                            {#each $jobsStore.filteredJobs as job}
                                <JobItem {job}/>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
