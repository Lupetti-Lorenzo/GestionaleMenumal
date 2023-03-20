<script>
    import JobItem from "./jobItem.svelte";

    import { createJobsStore, searchHandler } from "$lib/client/jobsStore.js"
    import { onMount, onDestroy } from "svelte";
    import { authUser } from "$lib/client/auth"

    let jobsStore = createJobsStore([])
    
    onMount(async () => {
        const formData = new FormData();

        formData.set('uid', $authUser.id)
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

{#if $jobsStore.jobs.length == 0}
        Loading....
{:else}
<div class="max-w-md">
    <div class="flex items-start justify-start font-sans overflow-hidden">
        <div>
            <div class="bg-white shadow-md rounded my-6">
                
                <input  class="rounded-t focus-within:shadow-lg bg-white min-w-max w-full px-6 py-3 bg-gray-200 text-gray-600 text-sm leading-normal" type="search" placeholder="Search..." bind:value={$jobsStore.search}/>
                
                <table class="min-w-max w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th scope="col" class="px-6 py-3">
                                Nome Locale
                            </th>
                            <th scope="col" class="px-6 py-3">
                                <span class="sr-only">Area Privata</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        {#each $jobsStore.filteredJobs as job}
                            <JobItem job={job}/>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
{/if}