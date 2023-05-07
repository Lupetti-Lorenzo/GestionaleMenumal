<script>
	import { page } from "$app/stores"
</script>

<div class="flex items-center justify-center h-full">
	<div class="bg-white">
		{#if $page?.error}
			<div class="flex flex-col items-center">
				{#if $page?.status}
					<h1 class="font-bold text-3xl text-blue-600 lg:text-6xl">{$page?.status}</h1>
				{/if}

				{#if $page?.error?.message}
					<h6 class="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
						<span class="text-red-500">Oops!</span>
						{$page?.error?.message}
					</h6>
				{/if}
			</div>
		{/if}
		<a href="/" class="px-6 py-2 text-sm font-semibold text-blue-200 bg-blue-600"
			>Ritorna alla home</a
		>
	</div>
</div>
