<script lang="ts">
	import { page } from "$app/stores";
	import IconButton from "$lib/components/IconButton.svelte";
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import { roles } from "$lib/utils/constants";
	import { getTarget, postData } from "$lib/utils/functions";
	import type { Employee } from "$lib/utils/types";
	import { Form, FormGroup, TextInput, Select, SelectItem } from "carbon-components-svelte";

	export let data;
	let employee: Employee = data.employee;
	let pwds: { old: string; new: string; confirm: string } = {
		old: "",
		new: "",
		confirm: ""
	};
	let open: boolean = false;
	let formWarn: boolean = false;

	$: {
		if (!open) {
			pwds.old = "";
			pwds.new = "";
			pwds.confirm = "";
			formWarn = false;
		}
	}

	async function changePwd(): Promise<void> {
		const data = await postData(`${getTarget($page.url.origin)}/employees/changePassword`, {
			email: employee.email,
			oldPassword: pwds.old,
			newPassword: pwds.new,
			newPasswordAgain: pwds.new
		});
		if (data === "") {
			formWarn = true;
			console.log("error");
		} else {
			open = false;
		}
	}
</script>

<div class="flex flex-row justify-between">
	<div class="flex flex-col gap-3">
		<div>
			<h2>{employee.name}</h2>
			<span>{employee.email}</span>
		</div>
		<span>Role: {roles[employee.role]}</span>
	</div>
	<div class="w-56">
		<IconButton
			title="Change password"
			icon="edit"
			color="primary"
			on:click={() => (open = true)}
		/>
	</div>
</div>

<ModalLayout bind:open on:formSubmit={() => changePwd()} heading={"Add new employee"}>
	<Form>
		<FormGroup>
			<div class="flex flex-col gap-3">
				<TextInput
					labelText="Old password (required)"
					placeholder="Enter your old password"
					type="password"
					bind:value={pwds.old}
				/>
				<TextInput
					labelText="New password (required)"
					placeholder="Enter new password"
					type="password"
					bind:value={pwds.new}
					invalidText=""
					invalid={pwds.new !== pwds.confirm && formWarn}
				/>
				<TextInput
					labelText="Confirm new password (required)"
					placeholder="Confirm new password"
					type="password"
					bind:value={pwds.confirm}
					invalidText="Enter a valid e-mail address"
					invalid={pwds.new !== pwds.confirm && formWarn}
				/>
			</div>
		</FormGroup>
	</Form>
</ModalLayout>
