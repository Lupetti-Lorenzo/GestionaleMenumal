<script>
    export let job
    async function apriBackDoor() { // fetcho il token e apro la pagina del job selezionato
        const res = await fetch("api/creaTokenBackDoor", {
            method: 'POST',
        });
        const token = await res.json()
        window.open(`https://menumal.it/areaprivata/login.php?job=${job}&token=${token}`, '_blank');
    }
</script>

<div class="jobItem">
    <p>{job}</p>
    <form method="POST" on:submit|preventDefault="{apriBackDoor}">
        <button type="submit" class="btn btn-primary">Area privata</button>
    </form>
</div>

<style>
    .jobItem {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 200px;
    }
</style>