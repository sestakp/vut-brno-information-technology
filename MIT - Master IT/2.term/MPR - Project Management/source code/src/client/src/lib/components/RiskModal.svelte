<script lang="ts">
	import { probabilities, impacts, states, threatCats, vulnerCats } from "$lib/utils/constants";
	import {
		ComboBox,
		Form,
		FormGroup,
		Select,
		SelectItem,
		TextArea,
		TextInput
	} from "carbon-components-svelte";
	import type { Risk, Template } from "$lib/utils/types";
	import type { ComboBoxItem } from "carbon-components-svelte/types/ComboBox/ComboBox.svelte";

	export let template: Template | Risk;
	export let formWarn: boolean;
	export let boxes: Array<ComboBox>;
	let newVulnerability: string = "";

	let vulnItems: Array<ComboBoxItem>;
	$: {
		let tmp: Array<ComboBoxItem> = [];
		if (newVulnerability !== "" && !vulnerCats.includes(newVulnerability)) {
			tmp = [{ id: -1 - newVulnerability.length, text: newVulnerability }];
		}
		vulnerCats
			.filter((x) => !template.vulnerabilities.includes(x))
			.forEach((x, i) => tmp.push({ id: i, text: x }));
		vulnItems = tmp;
	}

	let threatItems: Array<ComboBoxItem>;
	$: {
		let tmp: Array<ComboBoxItem> = [];
		if (template.category !== "" && !threatCats.includes(template.category)) {
			tmp = [{ id: -1 - template.category.length, text: template.category }];
		}
		threatCats.forEach((x, i) => tmp.push({ id: i, text: x }));
		threatItems = tmp;
	}

	function addVulnerability(): void {
		if (!template.vulnerabilities.includes(newVulnerability)) {
			template.vulnerabilities.push(newVulnerability);
			template.vulnerabilities = template.vulnerabilities;
			newVulnerability = "";
			boxes[1].clear();
		}
	}
</script>

<Form>
	<FormGroup noMargin>
		<div class="flex flex-col gap-3">
			<TextInput
				labelText="Name (required)"
				placeholder="Enter template name"
				type="text"
				bind:value={template.name}
				invalidText="Enter valid name"
				invalid={formWarn && template.name === ""}
			/>
			<TextArea
				maxCount={150}
				labelText="Description"
				placeholder="Enter template description"
				type="text"
				bind:value={template.description}
			/>
			<TextInput
				labelText="Cause (required)"
				placeholder="Risk cause"
				type="text"
				bind:value={template.cause}
				invalidText="Enter valid cause"
				invalid={formWarn && template.cause === ""}
			/>
			<ComboBox
				light
				titleText="Category (required)"
				placeholder="Select category"
				type="text"
				items={threatItems}
				selectedId={threatCats.includes(template.category)
					? threatCats.findIndex((x) => x === template.category)
					: -1 - template.category.length}
				bind:this={boxes[0]}
				bind:value={template.category}
				invalidText="Select category"
				invalid={formWarn && template.category === ""}
			/>
		</div>
	</FormGroup>
</Form>

<div class="flex flex-col gap-1">
	<span class="text-neutral-600 text-xs">Selected vulnerabilities (at least one required)</span>
	<div
		class="flex flex-row gap-2 bg-neutral-100 px-2 py-2 border-b border-neutral-400 border-solid flex-wrap"
	>
		{#each template.vulnerabilities as vulnerability}
			<button
				class="bg-neutral-400 p-1 px-2 rounded-lg flex flex-row place-items-center gap-1 hover:bg-red-500 transition-colors"
				on:click={() =>
					(template.vulnerabilities = template.vulnerabilities.filter((x) => x !== vulnerability))}
			>
				<img class="w-2 h-2" src="/x.svg" alt="x" />
				{vulnerability}
			</button>
		{/each}
	</div>
</div>
<Form>
	<FormGroup>
		<div class="flex flex-col gap-3">
			<ComboBox
				light
				placeholder="Add new vulnerability"
				type="text"
				items={vulnItems}
				bind:this={boxes[1]}
				bind:value={newVulnerability}
				on:select={() => addVulnerability()}
				invalidText="Add at least one vulnerability"
				invalid={formWarn && template.vulnerabilities.length === 0}
			/>
			<slot />
			<TextInput
				labelText="Control (required)"
				placeholder="Risk control"
				type="text"
				bind:value={template.control}
				invalidText="Enter valid control"
				invalid={formWarn && template.control === ""}
			/>
			<div class="flex flex-row gap-2">
				<div class="w-1/2">
					<Select
						labelText="Probability (required)"
						bind:selected={template.probability}
						invalidText="Choose one of the options"
						invalid={formWarn && template.probability === 0}
					>
						<SelectItem value="" text="Select risk probability" hidden />
						{#each probabilities as prob, i}
							<SelectItem value={i + 1} text={prob} />
						{/each}
					</Select>
				</div>
				<div class="w-1/2">
					<Select
						labelText="Impact (required)"
						bind:selected={template.impact}
						invalidText="Choose one of the options"
						invalid={formWarn && template.impact === 0}
					>
						<SelectItem value="" text="Select risk impact" hidden />
						{#each impacts as impact, i}
							<SelectItem value={i + 1} text={impact} />
						{/each}
					</Select>
				</div>
			</div>
			<Select
				labelText="State (required)"
				bind:selected={template.state}
				invalidText="Choose one of the options"
				invalid={formWarn && template.state === -1}
			>
				<SelectItem value="" text="Select state" hidden />
				{#each states as state, i}
					<SelectItem value={i} text={state} />
				{/each}
			</Select>
		</div>
	</FormGroup>
</Form>
