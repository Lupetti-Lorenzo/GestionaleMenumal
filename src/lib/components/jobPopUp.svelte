<script>
	import { CODICI_STATODB_MENUMAL } from "$lib/constants"
	// STORES
	import { popUpStore } from "$lib/client/jobPopUpStore"
	import { loaderStore } from "$lib/client/globalLoaderStore"
	import { notificationStore } from "$lib/client/notificationStore"
	import { jobsStore } from "$lib/client/jobsStore.js"
	// COMPONENTS
	import JobState from "./jobState.svelte"
	import DatePicker from "$lib/components/datePicker.svelte"
	import LoadingButton from "./loadingButton.svelte"
	// UTILITY
	import { parseDate, parseDateFromSlash } from "$lib/client/utility/dateFormatter"

	// variabili usate per renderizzare il popup
	let open
	let whichPopUp
	let popupData

	// nuovo stato, selezionato tramite select
	let newState // contente il valore selezionato del nuovo stato bindato al selector
	// array con oggetti con id e valore per il selector
	const codiciMenumalArray = Object.keys(CODICI_STATODB_MENUMAL).map((key) => {
		return { id: key, value: CODICI_STATODB_MENUMAL[key] }
	})
	//nuova data di scadenza, selezionato con DatePicker
	let newDate // data bindata al datepicker

	// quando cambia il contenuto  del popup aggiorno la ui
	$: aggiornaUI($popUpStore)
	function aggiornaUI(popUpStore) {
		open = popUpStore.open
		whichPopUp = popUpStore.whichPopUp
		popupData = { ...popUpStore.data }
		newState = popupData.dbState
		popupData.expireDate =
			popupData.expireDate || parseDateFromSlash(new Date().toLocaleDateString())
		newDate = popupData.expireDate
		//console.log(popupData.expireDate)
		// errore nella new date, rivedere il flow e la loginca
	}

	let loading = false // variabile per mostrare il loader e disabilitare gli input durante il caricamento

	// variabile per disabilitare il bottone completa se non ho fatto modifiche
	$: edited = newState != popupData.dbState || newDate != popupData.expireDate // di default non ci sono modifiche quindi disabilitato

	// cambia lo stato del job mandando una richiesta all'api in base ai dati scelti
	async function changeState() {
		loaderStore.showLoader() // far apparire loader in alto a destra
		loading = true

		// prima utilizzo i dati del popup poi lo chiudo e mi salvo i dati per il form e la notifica - anche per essere sicuro che non vengano sovrascritti da una riapertura veloce
		// costruisco il messaggio da mandare all'api
		const formData = await new FormData()
		formData.set("newState", newState)
		formData.set("newDate", newDate + " 00:00:00")
		formData.set("job", popupData.jobName)
		formData.set("newDateAT", parseDate(newDate))
		// notify data
		const notifJobName = popupData.jobName
		const notifPopupType = whichPopUp
		const notifState = newState
		loading = false
		popUpStore.closePopUp()

		// chiamata all'api
		const res = await fetch("api/changeJobState", {
			method: "PATCH",
			body: formData
		})

		const response = await res.json()

		await jobsStore.updateJobs(false)
		// aspetto la risposta e l'aggiornamento dei job poi chiudo il loader e faccio vedere il messaggio
		loaderStore.closeLoader()

		// Notifica all'utente in base al popup e l'esito della chiamata
		if (response.success) {
			if (notifPopupType === "full") {
				notificationStore.showNotification(
					`Stato di pagamento di ${notifJobName} aggiornato a ${CODICI_STATODB_MENUMAL[notifState]}`,
					"success"
				)
			} else if (notifPopupType === "trial") {
				notificationStore.showNotification(
					`Trial di ${notifJobName} esteso a ${newDate}`,
					"success"
				)
			}
		} else if (response.error) {
			if (notifPopupType === "full") {
				notificationStore.showNotification(
					`Errore nell' aggiornamento del pagamento di ${notifJobName}: ${response.message}`,
					"error"
				)
			} else if (notifPopupType === "trial") {
				notificationStore.showNotification(
					`Errore nell'estenzione del trial di ${notifJobName}: ${response.message}`,
					"error"
				)
			}
		}
	}

	// chiusura del popup se clicco fuori
	const outsideClick = (event) => {
		if (event.target.id == "popup" && !loading) popUpStore.closePopUp()
	}
</script>

{#if open}
	<!-- POPUP -->
	<div
		on:click|preventDefault={outsideClick}
		on:keypress={() => {}}
		id="popup"
		tabindex="-1"
		class="fixed top-0 left-0 right-0 z-50 w-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center justify-center align-center"
	>
		<div class="relative w-screen md:max-w-2xl   ">
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow border-4 border-grey-400">
				<!-- Modal header -->
				<div class="ml-4 flex items-start justify-between p-4 border-b rounded-t">
					<h3 class="text-xl font-semibold text-gray-900">
						{popupData.jobName}
						<JobState dbState={popupData.dbState} />
					</h3>
					<h2 class="ml-7 text-xl font-semibold text-gray-900">
						{whichPopUp == "full" ? "Cambia stato" : "Estendi trial"}
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
				{#if whichPopUp == "full"}
					<div class="p-7 space-y-6">
						<h3 class="text-xl font-semibold text-gray-900">
							Registrato il {popupData.registerDate}
						</h3>
						<span class="text-xl mr-3 font-semibold text-gray-900">Nuovo stato</span>
						<select
							bind:value={newState}
							disabled={loading}
							on:change={() => (newDate = popupData.expireDate)}
						>
							{#each codiciMenumalArray as codice}
								<option value={codice.id}>
									{codice.value}
								</option>
							{/each}
						</select>
						<br />
						<!-- DatePicker, lo mostro solo se aggiorno lo stato a trial o manuale -->
						{#if newState == "1" || newState == "3"}
							<div class="no-wrap">
								<span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
								<input
									type="text"
									bind:value={newDate}
									class="mt-4 mb-2 pl-1 rounded-lg border-1 shadow"
									disabled={loading}
								/>
							</div>
							<DatePicker bind:value={newDate} />
						{/if}
					</div>
				{:else if whichPopUp == "trial"}
					<div class="p-7 space-y-6">
						<h3 class="text-xl font-semibold text-gray-900 ">
							Registrato il {popupData.registerDate}
						</h3>
						<span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
						<input type="text" bind:value={newDate} disabled={loading} class="mt-4 mb-2 pl-1" />
						<DatePicker bind:value={newDate} />
					</div>
				{/if}

				<!-- Modal footer -->
				<div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
					<LoadingButton {loading} {edited} text="Conferma" on:completeCalled={changeState} />
					<!-- bottone completa -->
					<!-- <button
						on:click|preventDefault={popUpStore.closePopUp}
						type="button"
						disabled={loading}
						class="text-gray-500 ml-3 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
						>Annulla</button
					> -->
					<!-- bottone annulla -->
				</div>
			</div>
		</div>
	</div>
{/if}
