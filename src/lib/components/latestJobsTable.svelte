<script>
	import { jobsStore } from "$lib/client/jobsStore.js"
	import JobState from "./jobState.svelte"

	let totJobs = 5
	$: latestJobs = getOrderedJobs($jobsStore.jobs).slice(1).slice(-totJobs)

	// nextJobs, aggiorna latestJobs con 5 risultati in piu
	const moreJobs = () => (totJobs += 5)

	const getOrderedJobs = (jobs) => {
		return jobs
			.filter((job) => job.fields["dataRegistrazioneIT"])
			.sort((job1, job2) => {
				// ho gia filtrato quelli che non hanno entrambi i campi, con l'if faccio la preferenza su dataRegistrazione
				const dataRegistrazione1 = job1.fields["dataRegistrazioneIT"]
				const dataRegistrazione2 = job2.fields["dataRegistrazioneIT"]
				///const dataRegistrazione2 = job.fields['dataRegistrazione'] === undefined ? job.fields['Data registrazione'].replace() : job.fields['dataRegistrazione']
				job1 = dataRegistrazione1.split("-").reverse().join("")
				job2 = dataRegistrazione2.split("-").reverse().join("")
				return job1 > job2 ? 1 : job1 < job2 ? -1 : 0
			})
	}
</script>

<!-- ULTIME REGISTRAZIONI -->
<!-- Titolo Ultime Registrazioni -->
<h3
	class="mt-4 mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5x"
>
	Ultime Registrazioni
</h3>
<!-- Tabella popolata da latestJobs -->
<div class="overflow-x-auto">
	<table class="w-screen sm:max-w-2xl text-sm text-left text-gray-500">
		<thead class="text-xs text-gray-700 uppercase bg-gray-200">
			<tr>
				<th scope="col" class="pr-1 pl-3 md:px-6 py-3 rounded-l-lg"> Nome </th>
				<th scope="col" class="px-1 md:px-6 py-3"> Data Registrazione </th>
				<th scope="col" class="px-1 md:px-6 py-3 rounded-r-lg"> Email </th>
			</tr>
		</thead>
		<tbody>
			{#each latestJobs.reverse() as job}
				<tr class="bg-white text-xs sm:text-s md:text-base">
					<th
						scope="row"
						class="pr-1 pl-3 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
					>
						{job.fields["Opportunity name"]}
						<div class="hidden sm:inline"><JobState dbState={job.fields["StatoDB"]} /></div>
					</th>
					<td class="px-1 md:px-6 py-4">
						{job.fields["dataRegistrazioneIT"]}
					</td>
					<td class="px-1 md:px-6 py-4">
						{job.fields["Email"]}
					</td>
				</tr>
			{/each}
		</tbody>
		<!-- Footer contiene il bottone per caricare altri 5 risultati -->
		<tfoot class="flex flex-row justify-start items-center w-full">
			<th scope="row" class="px-6 py-3 text-base">
				<button
					on:click|preventDefault={moreJobs}
					class="font-semibold text-gray-900 mt-1 font-bold py-2 px-4 border-b-4 border-red-400 hover:mt-0 hover:border-t-4 rounded hover:scale-105 "
				>
					Altri
				</button>
			</th>
		</tfoot>
	</table>
</div>
