<script>
	import { get } from "svelte/store"

	import JobsTable from "$lib/components/jobsTable.svelte"
	import MenuSwitch from "$lib/components/menuSwitch.svelte"
	import StatisticsTable from "../lib/components/statisticsView.svelte"

	import { jobsStore, searchHandler } from "$lib/client/jobsStore.js"
	import { onMount } from "svelte"
	import { offlineMenager } from "$lib/client/offlineMenagerStore"
	import { online } from "$lib/client/onlineStore"

	onMount(async () => {
		// richiedo i jobs dall'api di airtable e li salvo in jobsStore, da cui viene creata la tabella e abilitata la funzionalita di ricerca
		await jobsStore.updateJobs()
		// mi sincronizzo con le richieste nel local storage
		offlineMenager.syncStorage()
		// // se sono offline e ci sono dei job non sincronizzati per refresh aggiorno la ui
		// if (!$online && get(offlineMenager).jobsOptimisticUI.lenght !== 0) {
		// 	const indexes = offlineMenager.renderOptimisticUI()
		// 	console.log(JSON.stringify(indexes))
		// 	console.log(JSON.stringify(get(offlineMenager).jobsOptimisticUI))
		// }
		if (!get(online)) offlineMenager.renderOptimisticUI()
		// // ogni volta che ce una nuova richiesta (cambia lo store), aggiorno localStorage con l'array di richieste
		offlineMenager.subscribe((store) => {
			localStorage.requestsPending = JSON.stringify(store.requestsPending)
		})
	})

	// utilizzo questa sintassi per iscrivere un il search handler ogni volta che cambia jobStore
	$: searchHandler($jobsStore)

	let menuSelection // variabile per cambiare la dashboard dopo aver cliccato in menuswitch
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<!-- DASHBOARD -->

<div id="" class="w-screen flex items-center flex-col justify-center">
	<div class="flex items-center flex-col justify-center font-sans w-screen md:max-w-3xl">
		<MenuSwitch bind:menuSelection />
		{#if menuSelection === "table"}
			<JobsTable />
		{:else if menuSelection === "stats"}
			<StatisticsTable />
		{/if}
	</div>
</div>
