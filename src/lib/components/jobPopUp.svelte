<script>
	import { popUpStore } from '$lib/client/jobPopUpStore';
	import { notificationStore } from '$lib/client/notificationStore';
	import JobState from './jobState.svelte';
	import DatePicker from '$lib/components/datePicker.svelte';
	import { CODICI_STATODB_MENUMAL } from '$lib/constants';
	import { authUser } from '$lib/client/authStore';


	// variabili usate per renderizzare il popup
	let open
	let whichPopUp
	let dbState 
	let jobName
	//let registerDate
	const registerDate = '2023-04-28';
	// nuovo stato, selezionato tramite select
	let newState; // contente il valore selezionato del nuovo stato bindato al selector
	// array con oggetti con id e valore per il selector
	const codiciMenumalArray = Object.keys(CODICI_STATODB_MENUMAL).map((key) => {
		return { id: key, value: CODICI_STATODB_MENUMAL[key] };
	});
	//nuova data di scadenza, selezionato con DatePicker
	let newDate; // data bindata al datepicker

	// quando cambia il contenuto  del popup aggiorno la ui
	$: aggiornaUI($popUpStore);
	function aggiornaUI(popUpStore) {
		open = popUpStore.open;
		whichPopUp = popUpStore.whichPopUp;
		dbState = popUpStore.data.dbState;
		jobName = popUpStore.data.jobName;
		//registerDate = popUpStore.registerDate
		newState = dbState;
		newDate = registerDate;
	}

	// variabile per disabilitare il bottone completa se non ho fatto modifiche
	$: edited = newState != dbState || newDate != registerDate; // di default non ci sono modifiche quindi disabilitato

	let loading = false; // variabile per mostrare il loader e disabilitare gli input durante il caricamento

	async function changeState(type) {
		loading = true; // far apparire loader e interrompere l'interazione

		await delay(2000);
		// const formData = await new FormData()
		// formData.id = $authUser
		// formData.newState = newState.toString()
		// formData.newDate = newDate
		// formData.job = jobName

		// const res = await fetch("api/changeJobState", {
		//     method: 'POST',
		//     body: formData
		// });

		// const response = await res.json()
		// console.log(JSON.stringify(response))
		// Notifica all'utente in base al popup e l'esito della chiamata
		if (whichPopUp === 'full') {
			notificationStore.showNotification(
				`Stato di pagamento di ${jobName} aggiornato a ${CODICI_STATODB_MENUMAL[newState]}`,
				'success'
			);
		} else if (whichPopUp === 'trial') {
			notificationStore.showNotification(`Trial di ${jobName} esteso a ${newDate}`, 'success');
		}
		loading = false;
		popUpStore.closePopUp();
	}

	function delay(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

    // chiusura del popup se clicco fuori
	const outsideClick = (event) => {
		if (event.target.id == 'popup' && !loading) popUpStore.closePopUp();
	};
</script>

{#if open}
	<!-- POPUP TAILWIND CSS -->
	<div
		on:click|preventDefault={outsideClick}
		on:keypress={() => {}}
		id="popup"
		tabindex="-1"
		class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center justify-center align-center"
	>
		<div class="relative w-full max-w-2xl max-h-full ">
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow border-4 border-grey-400">
				<!-- Modal header -->
				<div class="ml-4 flex items-start justify-between p-4 border-b rounded-t">
					<h3 class="text-xl font-semibold text-gray-900">
						{jobName}
						<JobState {dbState} />
					</h3>
					<h2 class="ml-7 text-xl font-semibold text-gray-900">
						{whichPopUp == 'full' ? 'Cambia stato' : 'Estendi trial'}
					</h2>
					<button
						on:click|preventDefault={popUpStore.closePopUp}
						disabled={loading}
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
					>
						<svg
							aria-hidden="true"
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				{#if whichPopUp == 'full'}
					<div class="p-7 space-y-6">
						<h3 class="text-xl font-semibold text-gray-900">Registrato il {registerDate}</h3>
						<span class="text-xl mr-3 font-semibold text-gray-900">Nuovo stato</span>
						<select
							bind:value={newState}
							on:change={() => (newDate = registerDate)}
							disabled={loading}
						>
							{#each codiciMenumalArray as codice}
								<option value={codice.id}>
									{codice.value}
								</option>
							{/each}
						</select>
						<br />
						<!-- DatePicker, lo mostro solo se aggiorno lo stato a trial o manuale -->
						{#if newState == '1' || newState == '3'}
							<span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
							<input type="text" bind:value={newDate} class="mt-4 mb-2 pl-1" disabled={loading} />
							<DatePicker bind:value={newDate} />
						{/if}
					</div>
				{:else if whichPopUp == 'trial'}
					<div class="p-7 space-y-6">
						<h3 class="text-xl font-semibold text-gray-900 ">Registrato il {registerDate}</h3>
						<span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
						<input type="text" bind:value={newDate} class="mt-4 mb-2 pl-1" disabled={loading} />
						<DatePicker bind:value={newDate} />
					</div>
				{/if}

				<!-- Modal footer -->
				<div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
					<button
						disabled={loading || !edited}
						on:click|preventDefault={changeState}
						type="button"
						class="{!edited
							? 'disabled'
							: ''} mr-3 text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					>
						{#if !loading}
							Completa
						{:else}
							<!-- Dopo aver cliccato completa faccio vedere un loader al posto della parola mentre esegue la richiesta-->
							<div role="status">
								<svg
									aria-hidden="true"
									class="inline w-5 h-5 text-gray-200 animate-spin fill-gray-600"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
								<span class="sr-only">Loading...</span>
							</div>
						{/if}
					</button>

					<button
						on:click|preventDefault={popUpStore.closePopUp}
						type="button"
						disabled={loading}
						class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
						>Annulla</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.disabled {
		background-color: #9ca3af;
	}
</style>
