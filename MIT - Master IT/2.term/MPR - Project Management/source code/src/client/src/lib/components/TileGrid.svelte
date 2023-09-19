<script lang="ts">
	import type { Project, Template } from "$lib/utils/types";
	import { SelectableTile, ClickableTile } from "carbon-components-svelte";

	export let filtered: Array<Project | Template>;
	export let selected: Array<string>;
	export let deleteMode: boolean;
	export let ref: string;
</script>

<div class="grid grid-cols-4 gap-5">
	{#each filtered as item}
		{#if deleteMode}
			<SelectableTile
				on:click={() => {
					if (selected.includes(item.id)) {
						selected = selected.filter((x) => x !== item.id);
					} else {
						selected.push(item.id);
					}
				}}
			>
				<slot {item} />
			</SelectableTile>
		{:else}
			<ClickableTile href={ref + item.id}>
				<slot {item} />
			</ClickableTile>
		{/if}
	{/each}
</div>
