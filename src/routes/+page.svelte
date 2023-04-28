<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";

    // import { authUser } from "../lib/client/auth";

    // import { invalidateAll } from "$app/navigation"

    //if ($authUser == null) invalidateAll();
</script>


<JobsTable/>

