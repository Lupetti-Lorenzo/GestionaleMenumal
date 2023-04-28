<script>
    import { CODICI_STATODB_MENUMAL } from "$lib/constants"

    export let dbState

    let bg 
    if (dbState == "0") bg = "bg-green-700"
    else if (dbState == "1") bg ="bg-yellow-500"
    else if (dbState == "2") bg ="bg-sky-500"
    else if (dbState == "3") bg ="bg-indigo-500"
    else if (dbState == "4") bg ="bg-red-700"

</script>

{#if CODICI_STATODB_MENUMAL[dbState] != null}
    <span class="rounded-md {bg}">
        {CODICI_STATODB_MENUMAL[dbState]}
    </span>
{/if}



<style>
    span {
        font-size: .7rem;
        color: whitesmoke;
        padding: 3px 5px;
    }
</style>