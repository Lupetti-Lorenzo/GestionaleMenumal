<script>
	import { notificationStore } from "$lib/client/notificationStore"
	$: type = $notificationStore.type
</script>

{#if $notificationStore.open}
	<div class="fixed top-2 right-2 font-medium text-sm -z-2">
		{#if type === "success"}
			<p class="px-5 py-2.5 rounded-lg bg-teal-100 border-teal-500 shadow-md">
				{$notificationStore.message}
			</p>
		{:else if type === "error"}
			<p class="px-5 py-2.5 rounded-lg bg-red-100 border border-red-400 text-red-700 shadow-md">
				{$notificationStore.message}
			</p>
		{/if}
	</div>
{/if}
