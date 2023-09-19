<script lang="ts">
	import { Form, FormGroup, TextInput } from "carbon-components-svelte";
	import type { Project } from "$lib/utils/types";
	import { deleteData, getTarget, postData } from "$lib/utils/functions";
	import { newProjectObj } from "$lib/utils/constObjs.js";
	import TileGrid from "$lib/components/TileGrid.svelte";
	import TileCard from "$lib/components/TileCard.svelte";
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import GridActions from "$lib/components/GridActions.svelte";
	import { page } from "$app/stores";
	import Snackbar from "$lib/components/Snackbar.svelte";

	export let data;
	let projects: Array<Project> = data.projects;
	let selected: Array<string> = [];
	let deleteMode: boolean = false;
	let filters: { search: string; status: string } = {
		search: "",
		status: "all"
	};
	let open: boolean = false;
	let newProject: Project = Object.assign({}, newProjectObj);
	let formWarn: boolean = false;
	let sending: boolean = false;
	let notification: { title: string; kind: string; msg: string } = {
		title: "",
		kind: "",
		msg: ""
	};

	$: filtered = projects
		? projects.filter(
				(x) =>
					((x.name && x.name.includes(filters.search)) ||
						(x.startDate && x.startDate.includes(filters.search)) ||
						(x.endDate && x.endDate.includes(filters.search))) &&
					(filters.status === "all" ||
						(!x.isFinished && filters.status === "progress") ||
						(x.isFinished && filters.status === "finished"))
		  )
		: [];

	$: if (!open) {
		newProject = Object.assign({}, newProjectObj);
		formWarn = false;
	}

	async function addProject(): Promise<void> {
		formWarn = newProject.name === "";
		if (!formWarn && !sending) {
			sending = true;
			const isoString = new Date().toISOString();
			const dateString = isoString.slice(0, 10);
			const result = dateString + "T00:00:00.000+00:00";
			newProject.startDate = result;
			const data = await postData(`${getTarget($page.url.origin)}/projects`, {
				id: null,
				name: newProject.name,
				startDate: newProject.startDate,
				endDate: null,
				isFinished: newProject.isFinished,
				projectManager: sessionStorage.email
			});
			if (data !== "") {
				if (
					await postData(`${getTarget($page.url.origin)}/projects/assignEmployee`, {
						projectId: data,
						employeeId: sessionStorage.email
					})
				) {
					newProject.id = data;
					projects.push(newProject);
					projects = projects;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Project created successfully!";
				} else {
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to add new project!";
				}
			}
			sending = false;
			open = false;
		}
	}

	async function removeProjects() {
		for (var id of selected) {
			if (await deleteData(`${getTarget($page.url.origin)}/projects/${id}`)) {
				projects = projects.filter((x) => x.id !== id);
			}
		}
		selected = [];
		deleteMode = false;
	}
</script>

<div class="flex flex-col gap-5">
	<GridActions bind:open bind:filters bind:deleteMode on:remove={() => removeProjects()}>
		<svelte:fragment>
			<div class="flex flex-row gap-2 shadow bg-white">
				<div class="self-center pl-2">Project state:</div>
				<select class="text-md bg-white p-3 hover:bg-neutral-200" bind:value={filters.status}>
					<option value="all">All projects</option>
					<option value="progress">Projects in progress</option>
					<option value="finished">Finished projects</option>
				</select>
			</div>
		</svelte:fragment>
	</GridActions>

	<TileGrid bind:filtered bind:selected bind:deleteMode ref={"/projects/"}>
		<svelte:fragment let:item>
			<TileCard tile={item} />
		</svelte:fragment>
	</TileGrid>
</div>

<ModalLayout bind:open on:formSubmit={() => addProject()} heading={"Create new project"}>
	<Form>
		<FormGroup noMargin>
			<TextInput
				labelText="Name (required)"
				placeholder="Enter project name"
				type="text"
				on:change={() => (formWarn = true)}
				bind:value={newProject.name}
				invalidText="Enter valid name"
				invalid={formWarn && newProject.name == ""}
			/>
		</FormGroup>
	</Form>
</ModalLayout>

<Snackbar bind:notification />
