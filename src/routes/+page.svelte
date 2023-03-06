<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";
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

<h1>Dashboard</h1>

<div class="container search">
	<input type="search" placeholder="Search..." bind:value={$jobsStore.search}/>
</div>

{#if $jobsStore.jobs.length == 0}
    Loading....
{:else}
    <JobsTable jobs={$jobsStore.filteredJobs}/>
{/if}


<style>
    .search {
        margin: 30px 0;
    }

    h1 {
        margin-top: 30px;
    }
</style>
