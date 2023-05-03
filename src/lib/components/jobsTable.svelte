<script>
	import JobItem from "./jobItem.svelte"
	import JobPopUp from "./jobPopUp.svelte"

	import { jobsStore } from "$lib/client/jobsStore.js"
	import { token } from "$lib/client/tokenMenager"
	import { onMount } from "svelte"

	let tokenn
	onMount(() => {
		token.subscribe((value) => {
			tokenn = value
		})
	})

	$: loadingJobs = $jobsStore.loading
</script>

<!-- Popup specializzato per le azioni in questa tabella-->
<JobPopUp />

<div class="{loadingJobs ? 'animate-pulse opacity-85' : ''} bg-white shadow-md my-4">
	<!-- SEARCH FIELD -->
	<input
		disabled={loadingJobs}
		class="rounded-t focus-within:shadow-lg min-w-max w-full px-6 py-3  {loadingJobs
			? 'opacity-85'
			: ''} bg-gray-200 text-gray-600 text-sm leading-normal"
		type="search"
		placeholder={loadingJobs ? "Caricamento..." : "Search..."}
		bind:value={$jobsStore.search}
	/>
	<!-- TABLE OF JOBS -->
	<table class="min-w-max w-full table-auto">
		<thead>
			<tr
				class="{loadingJobs
					? 'opacity-85'
					: ''} bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
			>
				<th scope="col" class="px-6 py-3">
					<span>Nome Locale</span>
				</th>
				<th scope="col" class="px-6 py-3">
					<span class="sr-only">Area Privata</span>
				</th>
				<th scope="col" class="px-6 py-3">
					<span class="sr-only">Cambia stato</span>
				</th>
				<th scope="col" class="px-6 py-3">
					<span class="sr-only">Estendi free trial</span>
				</th>
			</tr>
		</thead>
		<tbody class="text-gray-600 text-sm font-light">
			<!-- Mostro i jobs filitrati, inizialmente 0 quindi la tabella risulta chiusa -->
			{#if !loadingJobs}
				{#each $jobsStore.filteredJobs as job (job)}
					<JobItem {job} token={tokenn} />
				{/each}
			{/if}
		</tbody>
	</table>
</div>
