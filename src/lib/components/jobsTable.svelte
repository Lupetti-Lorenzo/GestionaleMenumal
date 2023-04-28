<script>
    import JobItem from "./jobItem.svelte";
    import PopUp from "./popUp.svelte";

    import { createJobsStore, searchHandler } from "$lib/client/jobsStore.js"
    import { onMount, onDestroy } from "svelte";

    let jobsStore = createJobsStore([])
    
    // richiedo i jobs dall'api e li salvo in jobsStore, da cui viene creata la tabella e abilitata la funzionalita di ricerca
    onMount(async () => {
        const formData = await new FormData()
        const res = await fetch("api/getJobs", {
            method: 'POST',
            body: formData
        });

        const jobs = await res.json()
        $jobsStore.jobs = jobs
    })

    const unsubscribe = jobsStore.subscribe((model) => searchHandler(model));
	onDestroy(() => {
		unsubscribe();
	});

</script>

<!-- Popup -->
<PopUp />

<div id="jobsTable" class="w-full">
    <div class="flex items-start justify-center font-sans overflow-hidden">
        <div>
            <div class="bg-white shadow-md my-6">
                <!-- SEARCH FIELD -->
                <input class="rounded-t focus-within:shadow-lg min-w-max w-full px-6 py-3 bg-gray-200 text-gray-600 text-sm leading-normal" type="search" placeholder="Search..." bind:value={$jobsStore.search}/>
                <!-- TABLE OF JOBS -->
                <table class="min-w-max w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
                        {#if $jobsStore.jobs.length != 0}
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
