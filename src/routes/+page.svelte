<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";
    export let data
</script>

<h1>Dashboard</h1>

<JobsTable jobs={data.jobs}/>
