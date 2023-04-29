<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";

    import { authUser } from "../lib/client/authStore";

    import { invalidateAll } from "$app/navigation"
    $: $authUser, async () => {$authUser == null ? await invalidateAll() : ""};

    //if ($authUser == null) invalidateAll();
</script>


<JobsTable/>

