<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";
    import { createJobsStore, searchHandler } from "$lib/client/jobsStore.js"
    import { onDestroy } from "svelte";

    export let data
    const jobsStore = createJobsStore(data.jobs)

    const unsubscribe = jobsStore.subscribe((model) => searchHandler(model));
	onDestroy(() => {
		unsubscribe();
	});

</script>

<h1>Dashboard</h1>

<div class="container search">
	<input type="search" placeholder="Search..." bind:value={$jobsStore.search}/>
</div>

<JobsTable jobs={$jobsStore.filteredJobs}/>

<style>
    .search {
        margin: 30px 0;
    }
</style>
