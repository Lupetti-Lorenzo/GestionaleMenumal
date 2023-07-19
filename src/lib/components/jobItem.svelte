<script>
	import JobState from "./jobState.svelte"

	import { popUpStore } from "$lib/client/changeStatePopUpStore"
	import { online } from "$lib/client/onlineStore"
	import { token as tokenStore } from "$lib/client/tokenAreaPrivataStore"

	export let job
	export let token

	const jobName = job.fields["Opportunity name"]
	const dbState = job.fields["StatoDB"] // stato di pagamento in cui è l'utente, 0 a vita, 1 trial, 2 stripe, 3 manuale, 4 disattivato
	const registerDate = job.fields["Data registrazione"]
	const expireDate = job.fields["dataScadenza"]

	async function apriBackDoor() {
		// fetcho il token e apro la pagina del job selezionato
		if (token == "") await tokenStore.setToken()
		window.open(`https://menumal.it/areaprivata/login.php?job=${jobName}&token=${token}`, "_blank")
	}

	const apriPopup = () => {
		popUpStore.showPopUp({ jobName, registerDate, dbState, expireDate })
	}
</script>

<tr class="border-b border-gray-200 overflow-hidden">
	<!-- Nome e icona stato -->
	<th
		scope="row"
		class="pl-2 sm:py-2 md:py-3 sm:px-3 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base text-left"
	>
		{jobName}
		<JobState {dbState} />
	</th>
	<!-- Bottoni -->
	<!-- Bottone area privata -->
	<td
		class="p-1 sm:py-2 md:py-3 sm:px-3 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base md:whitespace-nowrap text-left"
	>
		<button
			on:click|preventDefault={apriBackDoor}
			disabled={!$online}
			type="button"
			class="{!$online
				? 'disabled text-gray-600'
				: 'text-gray-500 bg-gray-300 hover:bg-gray-400 hover:text-gray-600'} inline-flex items-center px-2 py-3 md:py-4 md:px-5 rounded-md"
			>Area privata</button
		>
	</td>
	<!-- Bottone cambia stato, che apre il popup -->
	<td
		class="p-2 md:py-3 sm:px-3 md:px-5 text-xs sm:text-sm md:text-base md:whitespace-nowrap text-left"
	>
		<form method="POST" on:submit|preventDefault={apriPopup}>
			<button
				type="submit"
				class="inline-flex items-center px-2 py-3 md:py-4 md:px-5 text-gray-500 bg-gray-300 rounded-md hover:bg-gray-400 hover:text-gray-600"
				>{dbState != "1" ? "Cambia stato" : "Modifica trial"}</button
			>
		</form>
	</td>

	<!-- Dati dell'utente -->
	<td
		class="hidden sm:table-cell sm:py-2 md:py-3 sm:px-3 md:px-5 text-xs sm:text-sm md:text-base md:whitespace-nowrap text-center"
	>
		{expireDate}
	</td>
	<td
		class="hidden lg:table-cell sm:py-2 md:py-3 sm:px-3 md:px-5 text-xs sm:text-sm md:text-base md:whitespace-nowrap text-center"
	>
		{job.fields["Email"] || ""}
	</td>
	<td
		class="hidden xl:table-cell sm:py-2 md:py-3 sm:px-3 md:px-5 text-xs sm:text-sm md:text-base md:whitespace-nowrap text-center"
	>
		{job.fields["Status"] || ""}
	</td>
</tr>

<style>
	.disabled {
		background-color: #43454a5d;
	}
</style>
