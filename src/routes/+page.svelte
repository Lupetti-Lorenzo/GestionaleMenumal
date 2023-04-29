<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import JobsTable from "$lib/components/jobsTable.svelte";

    import { authUser } from "../lib/client/authStore";

    import { invalidateAll } from "$app/navigation"
    // controllo per refreshare quando user non autenticato, a volte non passa dalla load e non mostra la navbar
    $: $authUser, async () => {$authUser == null ? await invalidateAll() : ""};

</script>

<!-- DASHBOARD -->

<JobsTable/>

