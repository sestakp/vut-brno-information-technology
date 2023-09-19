<script lang="ts">
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination
	} from "carbon-components-svelte";

	export let title: string;
	export let desc: string;
	export let selected: any;
	export let filtered: any;
	export let headers: any;
	export let rows: any;
	export let pageSize: number;
	export let page: number;
</script>

<div class="shadow">
	<DataTable
		{title}
		description={desc}
		size="medium"
		sortable
		zebra
		selectable
		batchSelection
		bind:selectedRowIds={selected}
		{headers}
		{rows}
		{pageSize}
		{page}
	>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent value="" shouldFilterRows bind:filteredRowIds={filtered} />
				<slot name="actions" />
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:cell let:row>
			{#if cell.key === "overflow"}
				<slot name="overflow" {row} />
			{:else}{cell.value}{/if}
		</svelte:fragment>
	</DataTable>
	<Pagination bind:pageSize bind:page totalItems={rows.length} pageSizeInputDisabled />
</div>
