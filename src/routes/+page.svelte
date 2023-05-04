<script>
	import JobsTable from "$lib/components/jobsTable.svelte"
	import MenuSwitch from "$lib/components/menuSwitch.svelte"
	import StatisticsTable from "../lib/components/statisticsView.svelte"
	import { invalidateAll, invalidate } from "$app/navigation"
	import { authUser } from "$lib/client/authStore"

	import { jobsStore, searchHandler } from "$lib/client/jobsStore.js"
	import { onMount } from "svelte"

	export let data

	// richiedo i jobs dall'api di airtable e li salvo in jobsStore, da cui viene creata la tabella e abilitata la funzionalita di ricerca
	onMount(async () => {
		jobsStore.updateJobs()
		console.log(JSON.stringify(data))
		//if ($authUser == null) await invalidateAll() // controllo per refreshare quando user non autenticato, a volte non passa dalla load e non mostra la navbar
		if (data == null) await invalidate() // controllo per refreshare quando user non autenticato, a volte non passa dalla load e non mostra la navbar
	})

	// utilizzo questa sintassi per iscrivere un il search handler ogni volta che cambia jobStore
	$: searchHandler($jobsStore)

	let menuSelection // variabile per cambiare la dashboard dopo aver cliccato in menuswitch
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<!-- DASHBOARD -->

<div id="" class="w-full">
	<div class="flex items-center flex-col justify-center font-sans">
		<MenuSwitch bind:menuSelection />
		{#if menuSelection === "table"}
			<JobsTable />
		{:else if menuSelection === "stats"}
			<StatisticsTable />
		{/if}
	</div>
</div>
