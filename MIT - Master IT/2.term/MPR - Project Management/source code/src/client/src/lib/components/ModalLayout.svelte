<script lang="ts">
	import { Form, FormGroup, Modal } from "carbon-components-svelte";
	import { createEventDispatcher } from "svelte";

	export let open: boolean;
	export let heading: string;
	const dispatch = createEventDispatcher();

	function formSubmit() {
		dispatch("formSubmit");
	}
</script>

<Modal
	on:submit={formSubmit}
	bind:open
	preventCloseOnClickOutside
	modalHeading={heading}
	primaryButtonText="Submit"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
>
	<Form>
		<FormGroup>
			<div class="flex flex-col gap-3 mb-36">
				<slot />
			</div>
		</FormGroup>
	</Form>
</Modal>
