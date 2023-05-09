<script>
	import JobItem from "./jobItem.svelte"
	import ChangeStatePopUp from "./changeStatePopUp.svelte"

	import { jobsStore } from "$lib/client/jobsStore.js"

	import { online } from "$lib/client/onlineStore"
	import { browser } from "$app/environment"
	import { token } from "$lib/client/tokenAreaPrivataStore"

	// se sono sul browser, online e non ho un token lo refresho - anche per quando vado offline appena risono online riparte
	$: if (browser && $online && $token === "") token.setToken()

	$: loadingJobs = $jobsStore.loading

	let dateFilterEnabled = false

	let totJobs = 50 // righe della tabella fatte vedere
	// incrementatore di totjobs, bottone infondo
	const moreJobs = () => (totJobs += 40)
</script>

<!-- Popup specializzato per le azioni in questa tabella-->
<ChangeStatePopUp />

<div class="{loadingJobs ? 'animate-pulse opacity-85' : ''} bg-white shadow-md my-4">
	<!-- SEARCH FIELD -->
	<input
		disabled={loadingJobs}
		class="rounded-t text-base focus-within:shadow-lg min-w-max w-full px-6 py-3 touch-none  {loadingJobs
			? 'opacity-85'
			: ''} bg-gray-200 text-gray-600 text-sm leading-normal"
		type="search"
		placeholder={loadingJobs ? "Caricamento..." : "Search..."}
		bind:value={$jobsStore.search}
	/>
	<!-- TABLE OF JOBS -->
	<table class="table-auto">
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
				<!-- Questi dati non li mostro in mobile -->
				<th scope="col" class="hidden sm:table-cell px-6 py-3 sm:flex sm:row">
					<span>Data scadenza</span>
					<!-- bottone per ordinare per data scadenza -->
					<button
						on:click|preventDefault={() => {
							jobsStore.toggleDateFilter()
							dateFilterEnabled = !dateFilterEnabled
						}}
						class="sm:ml-3 p-1 md:p-2 text-grey-500 {dateFilterEnabled
							? 'border-2 border-gray-500 rounded-lg'
							: ''}"
						aria-label="ordina per data"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							focusable="false"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5 md:w-6 md:h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</button>
				</th>
				<th scope="col" class="hidden lg:table-cell px-6 py-3">
					<span>Email</span>
				</th>
				<th scope="col" class="hidden xl:table-cell px-6 py-3">
					<span>Status</span>
				</th>
			</tr>
		</thead>
		{#if !loadingJobs}
			<tbody class="text-gray-600 text-sm font-light">
				<!-- Mostro i jobs filitrati -->
				{#each $jobsStore.filteredJobs.slice(0, totJobs) as job (job)}
					<JobItem {job} token={$token} />
				{/each}
			</tbody>
			{#if $jobsStore.filteredJobs.length > totJobs}
				<tfoot class="flex flex-row justify-start items-center w-full">
					<th scope="row" class="px-1 py-2 lg:px-5 lg:py-3 text-base font-">
						<button
							on:click|preventDefault={moreJobs}
							class="font-semibold text-gray-900 mt-1 font-bold py-2 px-4 border-b-4 border-red-400 hover:mt-0 hover:border-t-4 rounded hover:scale-105 "
						>
							Altri
						</button>
					</th>
				</tfoot>
			{/if}
		{/if}
	</table>
</div>
