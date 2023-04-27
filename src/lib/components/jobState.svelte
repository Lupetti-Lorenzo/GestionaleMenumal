<script>
    export let dbState
</script>

{#if dbState == "0"}
<span class="rounded-md bg-green-700">
    A vita
</span>
{:else if dbState == "1"}
<span class="rounded-md bg-yellow-500">
    Trial
</span>
{:else if dbState == "2"}
<span class="rounded-md bg-sky-700">
    Stripe
</span>
{:else if dbState == "3"}
<span class="rounded-md bg-indigo-700">
    Manuale
</span>
{:else if dbState == "4"}
<span class="rounded-md bg-red-700">
    Disattivo
</span>
{/if}

<style>
    span {
        font-size: .7rem;
        color: whitesmoke;
        padding: 3px 5px;
    }
</style>