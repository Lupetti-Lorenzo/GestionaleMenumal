<script>
    import JobItem from "./jobItem.svelte";
    export let jobs

</script>

{#each jobs as job}
    <JobItem job={job}/>
{/each}