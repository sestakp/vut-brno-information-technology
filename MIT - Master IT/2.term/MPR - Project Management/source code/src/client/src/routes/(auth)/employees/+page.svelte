<script lang="ts">
	import type { Employee } from "$lib/utils/types";
	import { page } from "$app/stores";
	import {
		Form,
		FormGroup,
		Select,
		SelectItem,
		TextInput,
		OverflowMenu,
		OverflowMenuItem
	} from "carbon-components-svelte";
	import { deleteData, getTarget, postData, putData } from "$lib/utils/functions";
	import { roles } from "$lib/utils/constants";
	import { newEmployeeObj } from "$lib/utils/constObjs.js";
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import ActionsDataTable from "$lib/components/ActionsDataTable.svelte";
	import ProjectDataTable from "$lib/components/ProjectDataTable.svelte";
	import Snackbar from "$lib/components/Snackbar.svelte";

	export let data;
	let employees: Array<Employee> = data.employees;
	let newEmployee: Employee = Object.assign({}, newEmployeeObj);
	let selectedRowIds: Array<string> = [];
	let filteredRowIds: Array<string> = [];
	let pageSize: number = 15;
	let pageNum: number = 1;
	let open: boolean = false;
	let formWarn: boolean = false;
	let sending: boolean = false;
	let notification: { title: string; kind: string; msg: string } = {
		title: "",
		kind: "",
		msg: ""
	};

	let rows: any = [];
	$: if (employees) {
		rows = Array.from(employees).map((x) => ({
			id: x.id,
			name: x.name,
			email: x.email,
			role: roles[x.role]
		}));
	}
	$: if (!open) {
		newEmployee = Object.assign({}, newEmployeeObj);
		formWarn = false;
	}

	function checkName(name: string): boolean {
		const pattern = /^[a-zA-Zěščřžýáíéůú\'\s]+$/;
		return pattern.test(name.trim().toLowerCase());
	}

	function checkEmail(mail: string) {
		const pattern = /\w+@\w+\.\w+/;
		return pattern.test(mail.trim());
	}

	async function addEmployee(): Promise<void> {
		formWarn =
			!checkName(newEmployee.name) || !checkEmail(newEmployee.email) || newEmployee.role === -1;
		if (!formWarn && !sending) {
			sending = true;
			if (newEmployee.id !== null) {
				if (
					await putData(`${getTarget($page.url.origin)}/employees`, {
						...newEmployee,
						role: newEmployee.role
					})
				) {
					const index = employees.findIndex((x) => x.id === newEmployee.id);
					employees[index] = newEmployee;
					employees = employees;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Employee updated successfully!";
				} else {
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to update employee!";
				}
			} else {
				const data = await postData(`${getTarget($page.url.origin)}/employees/register`, {
					...newEmployee,
					id: null,
					role: newEmployee.role
				});
				if (data !== "") {
					newEmployee.id = data;
					employees.push(newEmployee);
					employees = employees;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Employee added successfully!";
				} else {
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to add new employee!";
				}
			}
			sending = false;
			open = false;
		}
	}

	async function removeEmployee(ids: Array<string>) {
		for (var id of ids) {
			if (await deleteData(`${getTarget($page.url.origin)}/employees/${id}`)) {
				employees = employees.filter((x) => x.id !== id);
			}
		}
		selectedRowIds = [];
	}
</script>

<ProjectDataTable
	title="List of employees"
	desc="List of registered users in the system"
	bind:selected={selectedRowIds}
	bind:filtered={filteredRowIds}
	headers={[
		{ key: "name", value: "Name" },
		{ key: "email", value: "E-mail" },
		{ key: "role", value: "Role" },
		{ key: "overflow", empty: true }
	]}
	bind:rows
	{pageSize}
	bind:page={pageNum}
>
	<svelte:fragment slot="actions">
		<ActionsDataTable
			deleteActive={selectedRowIds.length > 0}
			bind:open
			on:click={() => removeEmployee(selectedRowIds)}
		/>
	</svelte:fragment>
	<svelte:fragment slot="overflow" let:row>
		{#if sessionStorage.email !== row.id}
			<OverflowMenu flipped>
				<OverflowMenuItem
					text="Edit"
					on:click={() => {
						newEmployee = Object.assign({}, employees.filter((x) => x.id === row.id).pop());
						open = true;
					}}
				/>
				<OverflowMenuItem text="Remove" on:click={() => removeEmployee([row.id])} />
			</OverflowMenu>
		{/if}
	</svelte:fragment>
</ProjectDataTable>

<ModalLayout bind:open on:formSubmit={() => addEmployee()} heading={"Add new employee"}>
	<Form>
		<FormGroup>
			<div class="flex flex-col gap-3">
				<TextInput
					labelText="Full name (required)"
					placeholder="Enter full name of the employee"
					type="text"
					bind:value={newEmployee.name}
					invalidText="Enter a valid name"
					invalid={!checkName(newEmployee.name) && formWarn}
				/>
				<TextInput
					labelText="E-mail (required)"
					placeholder="Enter e-mail of the employee"
					type="email"
					bind:value={newEmployee.email}
					invalidText="Enter a valid e-mail address"
					invalid={!checkEmail(newEmployee.email) && formWarn}
				/>
				<Select
					labelText="Role (required)"
					bind:selected={newEmployee.role}
					invalidText="Choose one of the options"
					invalid={newEmployee.role === -1 && formWarn}
				>
					<SelectItem value="" text="Choose role of the employee" hidden />
					{#each roles as role, i}
						<SelectItem value={i} text={role} />
					{/each}
				</Select>
			</div>
		</FormGroup>
	</Form>
</ModalLayout>

<Snackbar bind:notification />
