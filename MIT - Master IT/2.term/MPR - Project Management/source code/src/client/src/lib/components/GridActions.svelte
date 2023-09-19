<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import IconButton from "./IconButton.svelte";

	export let deleteMode: boolean;
	export let filters: any;
	export let open: boolean;

	const dispatch = createEventDispatcher();
	function remove() {
		dispatch("remove");
	}
</script>

<div class="flex flex-row-reverse gap-2">
	<div class="flex flex-row w-1/4 gap-2">
		<IconButton
			title={deleteMode ? "Cancel" : "New"}
			icon={deleteMode ? "x" : "plus"}
			color={deleteMode ? "secondary" : "primary"}
			on:click={() => (deleteMode ? (deleteMode = false) : (open = true))}
		/>
		<IconButton
			title={deleteMode ? "Comfirm" : "Remove"}
			icon={deleteMode ? "check" : "trashcan"}
			color="danger"
			on:click={() => (deleteMode ? remove() : (deleteMode = true))}
		/>
	</div>
	{#if !deleteMode}
		<input
			type="text"
			placeholder="Vyhledat"
			class="input input-bordered shadow p-3 flex-grow"
			bind:value={filters.search}
		/>
		<slot />
	{/if}
</div>
