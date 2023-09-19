<script lang="ts">
	import { page } from "$app/stores";
	import IconButton from "$lib/components/IconButton.svelte";
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import RiskModal from "$lib/components/RiskModal.svelte";
	import Snackbar from "$lib/components/Snackbar.svelte";
	import { impacts, probabilities, riskColors, risksValues, states } from "$lib/utils/constants";
	import { getTarget, putData } from "$lib/utils/functions.js";
	import type { Template } from "$lib/utils/types";
	import type { ComboBox } from "carbon-components-svelte";

	export let data;
	let template: Template = data.template;
	let open: boolean = false;
	let formWarn: boolean = false;
	let sending: boolean = false;
	let boxes: Array<ComboBox> = [];
	let newTemplate: Template = Object.assign({}, template);
	let notification: { title: string; kind: string; msg: string } = {
		title: "",
		kind: "",
		msg: ""
	};

	$: if (!open) {
		newTemplate = Object.assign({}, template);
		boxes.forEach((x) => x.clear());
		formWarn = false;
	}

	async function editTemplate(): Promise<void> {
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
			if (await putData(`${getTarget($page.url.origin)}/riskTemplates`, newTemplate)) {
				template = newTemplate;
				open = false;
				notification.kind = "success";
				notification.title = "Success:";
				notification.msg = "Template updated successfully!";
			} else {
				notification.kind = "error";
				notification.title = "Error:";
				notification.msg = "Unable to update template!";
			}
			sending = false;
		}
	}
</script>

{#if template}
	<div class="flex flex-col gap-3">
		<div class="flex flex-row justify-between">
			<div class="flex flex-row gap-5 place-items-center">
				<div class="font-semibold text-3xl">{template.name}</div>
				<div class="flex text-md text-white bg-neutral-500 rounded p-2 place-items-center">
					{template.category}
				</div>
			</div>
			<div class="w-32 h-5 ">
				<IconButton title="Edit" icon="edit" on:click={() => (open = true)} />
			</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Description:</div>
			<p class="text-md">{template.description}</p>
		</div>
		<div>
			<div class="font-semibold text-lg">Cause:</div>
			<div>{template.cause}</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Vulnerabilities:</div>
			<div>{template.vulnerabilities}</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Impact:</div>
			<div>{impacts[template.impact - 1]}</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Probability:</div>
			<div>{probabilities[template.probability - 1]}</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Risk:</div>
			<div class="flex">
				<div class={`p-1 rounded ${riskColors[template.probability * template.impact - 1]}`}>
					{risksValues[template.probability * template.impact]}
				</div>
			</div>
		</div>
		<div>
			<div class="font-semibold text-lg">Control:</div>
			<div>{template.control}</div>
		</div>
		<div>
			<div class="font-semibold text-lg">State:</div>
			<div>{states[template.state]}</div>
		</div>
	</div>
{/if}

<ModalLayout bind:open on:formSubmit={() => editTemplate()} heading={"Update risk template"}>
	<RiskModal bind:template={newTemplate} bind:formWarn bind:boxes />
</ModalLayout>

<Snackbar bind:notification />
