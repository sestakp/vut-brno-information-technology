<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import IconButton from "./IconButton.svelte";

	export let deleteActive: boolean;
	export let disabled: boolean = false;
	export let open: boolean;
	export let riskFlag: boolean = false;
	export let riskGlobal: boolean = false;

	const dispatch = createEventDispatcher();
	function dispatchClick() {
		dispatch("click", {});
	}
</script>

<div class="flex flex-row">
	{#if deleteActive}
		<IconButton
			title=""
			icon="trashcan"
			color="danger"
			{disabled}
			on:click={() => dispatchClick()}
		/>
	{/if}
	<IconButton
		title=""
		icon="plus"
		color="primary"
		{disabled}
		on:click={() => {
			open = true;
			riskGlobal = riskFlag;
		}}
	/>
</div>
