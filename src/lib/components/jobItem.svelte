<script>
	import JobState from "./jobState.svelte"

	import { token } from "$lib/client/tokenMenager"
	import { popUpStore } from "$lib/client/jobPopUpStore"

	export let job

	const jobName = job.fields["Opportunity name"]
	const dbState = job.fields["StatoDB"] // stato di pagamento in cui è l'utente, 0 a vita, 1 trial, 2 stripe, 3 manuale, 4 disattivato
	const registerDate = job.fields["Data registrazione"]
	const expireDate = job.fields["dataScadenza"]

	async function apriBackDoor() {
		// fetcho il token e apro la pagina del job selezionato
		window.open(`https://menumal.it/areaprivata/login.php?job=${jobName}&token=${$token}`, "_blank")
	}

	const apriPopup = (event) => {
		const whichPopup = event.target.dataset.id
		popUpStore.showPopUp(whichPopup, { jobName, registerDate, dbState, expireDate })
	}
</script>

<tr class="border-b border-gray-200 m">
	<th scope="row" class="py-3 px-5 text-left whitespace-nowrap">
		{jobName}
		<JobState {dbState} />
	</th>

	<td class="py-3 px-5 text-left">
		<form method="POST" on:submit|preventDefault={apriBackDoor}>
			<button
				type="submit"
				class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600"
				>Area privata</button
			>
		</form>
	</td>
	{#if dbState !== undefined}
		<!-- Se non è settato lo stato nel db non faccio vedere i bottoni aggiuntivi -->
		<!-- Bottone cambia stato, che apre il popup -->
		<td class="py-3 px-5  text-left">
			<form method="POST" on:submit|preventDefault={apriPopup} data-id="full">
				<button
					type="submit"
					class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600"
					>Cambia stato</button
				>
			</form>
		</td>

		<!-- Bottone estendi free trial, apre il popup in versione trial-->
		{#if dbState == "1" || dbState == "3"}
			<td class="py-3 px-5  text-left">
				<form method="POST" on:submit|preventDefault={apriPopup} data-id="trial">
					<button
						type="submit"
						class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600"
						>Estendi trial</button
					>
				</form>
			</td>
		{/if}
	{/if}
</tr>
