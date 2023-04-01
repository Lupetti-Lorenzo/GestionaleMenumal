<script>
    import { authUser } from "$lib/client/auth"
    export let job

    async function apriBackDoor() { // fetcho il token e apro la pagina del job selezionato
        const formData = new FormData();
        formData.set('uid', $authUser.id)
        const res = await fetch("api/creaTokenBackDoor", {
            method: 'POST',
            body: formData
        });
        const token = await res.json()
        window.open(`https://menumal.it/areaprivata/login.php?job=${job.fields['Opportunity name']}&token=${token}`, '_blank');
    }
</script>

<tr class="border-b border-gray-200 hover:bg-gray-100">
    <th scope="row" class="py-3 px-6 text-left whitespace-nowrap">
        {job.fields['Opportunity name']}
    </th>
    <td class="py-3 px-6 text-left">
        <form method="POST" on:submit|preventDefault="{apriBackDoor}">
            <button type="submit" class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600">Area privata</button>
        </form>
    </td>
    <!-- altre colonne contenenti altri dati presi da airtable -->
</tr>