<script lang="ts">
	import { riskColors } from "$lib/utils/constants";
	import type { Project, Template } from "$lib/utils/types";

	export let tile: Template | Project;
	const isRisk = (x: any): x is Template => x.category || x.cause || x.control;
</script>

{#if isRisk(tile)}
	<div class="flex flex-col gap-2">
		<h4 class="break-words line-clamp-2 font-semibold">{tile.name}</h4>
		<div class="flex flex-col gap-3">
			<div class="flex flex-row justify-between">
				<p class="text-xs text-white bg-neutral-500 rounded px-2 py-1">{tile.category}</p>
				<p
					class={`text-xs text-white rounded px-2 py-1 ${
						riskColors[tile.impact * tile.probability - 1]
					}`}
				>
					Risk {tile.impact * tile.probability}
				</p>
			</div>
			<p class="text-xs line-clamp-2 break-words">
				{tile.description}
			</p>
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-2">
		<h4 class="font-semibold">{tile.name}</h4>
		<div class="flex flex-row justify-between">
			<div>
				<p class="text-xs">Began: {new Date(tile.startDate).toLocaleDateString()}</p>
				<p class="text-xs">
					Ended: {tile.endDate === "" || tile.endDate === null
						? "-"
						: new Date(tile.endDate).toLocaleDateString()}
				</p>
			</div>
			{#if tile.isFinished}
				<div class="self-center w-7 h-7"><img src="squareCheckedBlack.svg" alt="checkbox" /></div>
			{:else}
				<div class="self-center w-7 h-7"><img src="squareMinus.svg" alt="checkbox" /></div>
			{/if}
		</div>
	</div>
{/if}
