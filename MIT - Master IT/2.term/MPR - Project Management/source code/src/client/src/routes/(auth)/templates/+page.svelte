<script lang="ts">
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import RiskModal from "$lib/components/RiskModal.svelte";
	import { risksValues } from "$lib/utils/constants";
	import { deleteData, getTarget, postData } from "$lib/utils/functions";
	import { newTempRiskObj } from "$lib/utils/constObjs.js";
	import type { Template } from "$lib/utils/types";
	import TileGrid from "$lib/components/TileGrid.svelte";
	import TileCard from "$lib/components/TileCard.svelte";
	import GridActions from "$lib/components/GridActions.svelte";
	import type { ComboBox } from "carbon-components-svelte";
	import { page } from "$app/stores";
	import Snackbar from "$lib/components/Snackbar.svelte";

	export let data;
	let templates: Array<Template> = data.templates;
	let deleteMode: boolean = false;
	let open: boolean = false;
	let formWarn: boolean = false;
	let sending: boolean = false;
	let selected: Array<string> = [];
	let filters: { search: string; category: string; risk: string } = {
		search: "",
		category: "all",
		risk: "all"
	};
	let boxes: Array<ComboBox> = [];
	let notification: { title: string; kind: string; msg: string } = {
		title: "",
		kind: "",
		msg: ""
	};

	$: categories = templates
		? new Set(
				templates
					.map((x) => x.category)
					.filter((x) => x)
					.sort((x, y) => {
						if (x > y) {
							return 1;
						} else if (x < y) {
							return -1;
						}
						return 0;
					})
		  )
		: [];

	let newTemplate: Template = Object.assign({}, newTempRiskObj);

	$: if (!open) {
		newTemplate = Object.assign({}, newTempRiskObj);
		newTemplate.vulnerabilities = [];
		boxes.forEach((x) => x.clear());
		formWarn = false;
	}

	$: filtered = templates
		? templates
				.filter(
					(x) =>
						(x.name && x.name.toLowerCase().includes(filters.search.toLocaleLowerCase())) ||
						(x.category && x.category.toLowerCase().includes(filters.search.toLocaleLowerCase()))
				)
				.filter(
					(x) =>
						(filters.category === "all" || x.category === filters.category) &&
						(filters.risk === "all" ||
							(x.impact * x.probability &&
								risksValues[x.impact * x.probability - 1].toLowerCase() === filters.risk))
				)
		: [];

	async function addTemplate(): Promise<void> {
		formWarn = false;
		Object.getOwnPropertyNames(newTemplate)
			.filter((x) => x !== "description" && x !== "id")
			.forEach((property) => {
				const value = newTemplate[property as keyof Template];
				if (value === "" || value === -1 || (typeof value === "object" && value.length === 0)) {
					formWarn = true;
				}
			});
		if (!formWarn && !sending) {
			sending = true;
			const temp = Object.assign({}, newTemplate);
			newTemplate = Object.assign({}, newTempRiskObj);
			const data = await postData(`${getTarget($page.url.origin)}/riskTemplates`, {
				...temp,
				id: null
			});
			if (data !== "") {
				temp.id = data;
				templates.push(temp);
				templates = templates;
				notification.kind = "success";
				notification.title = "Success:";
				notification.msg = "Template created successfully!";
				open = false;
			} else {
				newTemplate = Object.assign({}, temp);
				notification.kind = "error";
				notification.title = "Error:";
				notification.msg = "Unable to add new template!";
			}
			sending = false;
		}
	}

	async function removeTemplates() {
		for (var template of selected) {
			if (await deleteData(`${getTarget($page.url.origin)}/riskTemplates/${template}`)) {
				templates = templates.filter((x) => x.id !== template);
			}
		}
		selected = [];
		deleteMode = false;
	}
</script>

<div class="flex flex-col gap-5">
	<GridActions bind:open bind:filters bind:deleteMode on:remove={() => removeTemplates()}>
		<svelte:fragment>
			<div class="flex flex-row gap-2 shadow bg-white">
				<div class="self-center pl-2">Risk:</div>
				<select class="text-md bg-white p-3 hover:bg-neutral-200" bind:value={filters.risk}>
					<option value="all">Any risk</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
			</div>
			<div class="flex flex-row gap-2 shadow bg-white">
				<div class="self-center pl-2">Category:</div>
				<select class="text-md bg-white p-3 hover:bg-neutral-200" bind:value={filters.category}>
					<option value="all">Any category</option>
					{#each Array.from(categories) as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
		</svelte:fragment>
	</GridActions>

	<TileGrid bind:filtered bind:selected bind:deleteMode ref={"/templates/"}>
		<svelte:fragment let:item>
			<TileCard tile={item} />
		</svelte:fragment>
	</TileGrid>
</div>

<ModalLayout bind:open on:formSubmit={() => addTemplate()} heading={"Add new risk template"}>
	<RiskModal bind:template={newTemplate} bind:formWarn bind:boxes />
</ModalLayout>

<Snackbar bind:notification />
