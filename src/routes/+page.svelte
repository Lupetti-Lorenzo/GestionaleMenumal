<svelte:head>
    <title>Dashboard</title>
</svelte:head>


<script>
    // per ora lo fo qui, avevo trovato modo che se cliccavi non faceva propiro nulla, cosi invece flesha la dashboard e poi ti rimette alla login
    // video degli hooks di sicuro o  forse era altra roba
    import { deserialize } from "$app/forms";

    let res = ""
    let token = ""

    async function creaBackDoor() {
        const formData = new FormData();
        const response = await fetch("?/creaTokenBackDoor", {
            method: 'POST',
            body: formData
        });
        const result = deserialize(await response.text())
        res = JSON.stringify(result)
        token = JSON.stringify(result.data.token)
        window.open("https://menumal.it/areaprivata/login.php?job=hermes&token="+result.data.token, '_blank');
    }

</script>

<h1>Dashboard</h1>


<form method="POST" on:submit|preventDefault="{creaBackDoor}">
    <button type="submit" class="btn btn-primary">Prova Back Door</button>
    {#if res!=""}
        <br>
        <p>response: {res}</p>
        <p>token: {token}</p>
    {/if}
</form>

