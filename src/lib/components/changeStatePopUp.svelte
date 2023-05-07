<script>
	import { CODICI_STATODB_MENUMAL } from "$lib/constants"
	import { get } from "svelte/store"
	// STORES
	import { popUpStore } from "$lib/client/changeStatePopUpStore"
	import { notificationStore } from "$lib/client/notificationStore"
	import { jobsStore } from "$lib/client/jobsStore.js"
	import { authUser } from "$lib/client/authStore.js"
	import { offlineMenager } from "$lib/client/offlineMenagerStore"
	import { online } from "$lib/client/onlineStore"
	import { loaderStore } from "$lib/client/globalLoaderStore"

	// COMPONENTS
	import JobState from "./jobState.svelte"
	import DatePicker from "$lib/components/datePicker.svelte"
	import LoadingButton from "./loadingButton.svelte"
	// UTILITY
	import { parseDate, parseDateFromSlash } from "$lib/client/utility/dateFormatter"

	// variabili usate per renderizzare il popup
	let open
	let popupData

	// nuovo stato, selezionato tramite select
	let newState // contente il valore selezionato del nuovo stato bindato al selector
	// array con oggetti con id e valore per il selector
	const codiciMenumalArray = Object.keys(CODICI_STATODB_MENUMAL).map((key) => {
		return { id: key, value: CODICI_STATODB_MENUMAL[key] }
	})
	//nuova data di scadenza, selezionato con DatePicker
	let newDate // data bindata al datepicker

	// viene chiamata quando clicco il bottone per aprire il popup, resetta il popup in base a chi ho cliccato
	$: aggiornaUI($popUpStore)
	function aggiornaUI(popUpStore) {
		open = popUpStore.open
		popupData = { ...popUpStore.data }
		newState = popupData.dbState || "3"
		popupData.expireDate =
			popupData.expireDate || parseDateFromSlash(new Date().toLocaleDateString())
		newDate = popupData.expireDate
	}

	let loading = false // variabile per mostrare il loader e disabilitare gli input durante il caricamento

	// variabile per disabilitare il bottone completa se non ho fatto modifiche
	$: edited = newState != popupData.dbState || newDate != popupData.expireDate // di default non ci sono modifiche quindi disabilitato

	// cambia lo stato del job mandando una richiesta all'api in base ai dati scelti
	async function changeState() {
		loaderStore.showLoader() // far apparire loader in alto a destra
		loading = true // per disabilitare l'interazione, mi serve il popup aperto per prendere i  dati

		// prima utilizzo i dati del popup poi lo chiudo e mi salvo i dati per il form e la notifica - anche per essere sicuro che non vengano sovrascritti da una riapertura veloce
		// costruisco il messaggio da mandare all'api

		// notify data
		const notifJobName = popupData.jobName
		const notifState = newState

		// i dati da mandare nel body
		const data = {
			id: get(authUser).id,
			newState: newState,
			newDate: newDate + " 00:00:00",
			job: popupData.jobName,
			newDateAT: parseDate(newDate)
		}

		loading = false
		popUpStore.closePopUp()

		// se sono offline aggiungo la richiesta alle pending requests e aggiorno la ui manualmente
		if (!get(online)) {
			// aggiungo la richiesta alle pending
			offlineMenager.addRequest({
				url: "api/changeJobState",
				method: "PATCH",
				body: data
			})
			// aggiungo l'update al local storage, al refresh se non mi sono riconnesso alla rete riaggiorno la ui con le modifiche fatte offline
			const jobsOptimisticUI = JSON.parse(localStorage.jobsOptimisticUI)
			jobsOptimisticUI.push({ job: data.job, newState: data.newState, newDate: data.newDate })
			localStorage.jobsOptimisticUI = JSON.stringify(jobsOptimisticUI)
			// aggiornoUI,chiudo loader globale e mando notifica di successo - optimistic UI
			jobsStore.updateJobState(data.job, data.newState, data.newDate)
			loaderStore.closeLoader()
			sendPopUpNotification({ success: true }, notifJobName, notifState)
		}
		// se sono online faccio la normale chiamata all'api e aggiornamento con airtable
		// aspetto la risposta e l'aggiornamento dei job poi chiudo il loader e faccio vedere la notifica
		else {
			// chiamata api
			const formData = new FormData()
			for (const [key, value] of Object.entries(data)) formData.set(key, value) // setto il form data in base alla costante data
			const res = await fetch("api/changeJobState", {
				method: "PATCH",
				body: formData
			})

			// aggiorno tabella tramite airtable
			await jobsStore.updateJobs(false)
			// mando notifica
			const response = await res.json()
			// chiudo loader globale e mando notifica
			loaderStore.closeLoader()
			sendPopUpNotification(response, notifJobName, notifState)
		}
	}

	const sendPopUpNotification = (response, notifJobName, notifState) => {
		// Notifica all'utente in base al popup e l'esito della chiamata
		if (response.success && notifState != 1)
			notificationStore.addNotification(
				`Stato di pagamento di ${notifJobName} aggiornato a ${CODICI_STATODB_MENUMAL[notifState]}`,
				"success"
			)
		else if (response.success && notifState == 1)
			notificationStore.addNotification(`Trial di ${notifJobName} esteso a ${newDate}`, "success")
		else if (response.error && notifState != 1)
			// cambio di stato
			notificationStore.addNotification(
				`Errore nell' aggiornamento del pagamento di ${notifJobName}: ${response.message}`,
				"error"
			)
		else if (response.error && notifState == 1)
			// trial
			notificationStore.addNotification(
				`Errore nell'estenzione del trial di ${notifJobName}: ${response.message}`,
				"error"
			)
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
		class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center justify-center align-center"
	>
		<div class="relative w-full sm:max-w-2xl">
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow border-4 border-grey-400">
				<!-- Modal heade con nome, stato, messaggio e icona per chiudere -->
				<div class="ml-4 flex items-start justify-between p-4 border-b rounded-t">
					<h3 class="text-xl font-semibold text-gray-900">
						{popupData.jobName}
						<JobState dbState={popupData.dbState} />
					</h3>
					<h2 class="ml-7 text-xl font-semibold text-gray-900">
						{popupData.dbState != "1" ? "Cambia stato" : "Modifica trial"}
					</h2>
					<!-- Bottone X in alto a destra del popup per chiudere -->
					<button
						on:click|preventDefault={popUpStore.closePopUp}
						disabled={loading}
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
						aria-label="chiudi popup"
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
				<!-- Modal body-->
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
				<!-- Modal footer -->
				<div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
					<!-- bottone completa -->
					<LoadingButton
						{loading}
						disabled={!edited}
						text="Conferma"
						on:completeCalled={changeState}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
