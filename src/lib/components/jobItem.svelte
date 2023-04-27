<script>
    import { authUser } from "$lib/client/auth"
	import JobState from "./jobState.svelte";
    
    export let job

    async function apriBackDoor() { // fetcho il token e apro la pagina del job selezionato
        const formData = new FormData();
        formData.set('uid', $authUser.id)
        const res = await fetch("api/creaTokenMenumal", {
            method: 'POST',
            body: formData
        });
        const token = await res.json()
        window.open(`https://menumal.it/areaprivata/login.php?job=${job.fields['Opportunity name']}&token=${token}`, '_blank');
    }

    // job.fields['StatoDB'] // numerico, 0 a vita, 1 trial, 2 stripe, 3 manuale, 4 disattivato
    // job.fields['dataRegistrazione']

    // tutti - cambia stato 
    // trial - estendi



    async function cambiaStato() {
        job.fields['Opportunity name']
        job.fields['StatoDB']

        //apro popup

        // prendo il token
        const formData = new FormData();
        formData.set('uid', $authUser.id)
        const res = await fetch("api/creaTokenBackDoor", {
            method: 'POST',
            body: formData
        });
        const token = await res.json()


    }

    async function estendiFreeTrial() { // mandare job e data di fine presa da una datapicker

    }

</script>

<tr class="border-b border-gray-200 hover:bg-gray-100">
    <th scope="row" class="py-3 px-6 text-left whitespace-nowrap">
        {job.fields['Opportunity name']} <JobState dbState={job.fields['StatoDB']} />
    </th>

    <td class="py-3 px-6 text-left">
        <form method="POST" on:submit|preventDefault="{apriBackDoor}">
            <button type="submit" class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600">Area privata</button>
        </form>
    </td>

    <td>
        <!-- Bottone cambia stato, che apre il modal con il contenuto in content -->
        <form method="POST" on:submit|preventDefault="{cambiaStato}">
            <button type="submit" class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600">Cambia Stato</button>
        </form>
    </td>

    <!-- Bottone estendi free trial -->
    {#if job.fields['statoDB'] == "1"}
        <td>
            <form method="POST" on:submit|preventDefault="{estendiFreeTrial}">
                <button type="submit" class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600">Estendi trial</button>
            </form>
        </td>
    {/if}
</tr>