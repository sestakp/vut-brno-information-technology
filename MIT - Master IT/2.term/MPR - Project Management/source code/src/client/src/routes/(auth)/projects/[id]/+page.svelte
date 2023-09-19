<script lang="ts">
	import { page } from "$app/stores";
	import ActionsDataTable from "$lib/components/ActionsDataTable.svelte";
	import IconButton from "$lib/components/IconButton.svelte";
	import ModalLayout from "$lib/components/ModalLayout.svelte";
	import ProjectDataTable from "$lib/components/ProjectDataTable.svelte";
	import RiskModal from "$lib/components/RiskModal.svelte";
	import Snackbar from "$lib/components/Snackbar.svelte";
	import { newOportObj, newPhaseObj, newRiskObj } from "$lib/utils/constObjs.js";
	import {
		impacts,
		oporPrios,
		probabilities,
		riskColors,
		risksValues,
		states
	} from "$lib/utils/constants";
	import { deleteData, getTarget, postData, putData } from "$lib/utils/functions.js";
	import type { Employee, Opportunity, Phase, Project, Risk, Template } from "$lib/utils/types";
	import {
		ComboBox,
		DatePicker,
		DatePickerInput,
		Form,
		FormGroup,
		InlineNotification,
		OverflowMenu,
		OverflowMenuItem,
		Select,
		SelectItem,
		TextInput
	} from "carbon-components-svelte";
	import type { ComboBoxItem } from "carbon-components-svelte/types/ComboBox/ComboBox.svelte.js";

	export let data;
	let project: Project = data.project;
	let phases: Array<Phase> = data.phases;
	let risks: Array<Risk> = data.risks;
	let opportunities: Array<Opportunity> = data.opportunities;
	let participants: Array<Employee> = data.participants;
	let employees: Array<Employee> = data.employees;
	let templates: Array<Template> = data.templates;
	let notification: { title: string; kind: string; msg: string } = {
		title: "",
		kind: "",
		msg: ""
	};

	let riskMatrix: Array<{ color: string; quantity: number }> = [];
	$: {
		riskMatrix = [];
		for (let i: number = 5; i > 0; i--) {
			for (let j: number = 1; j < 6; j++) {
				riskMatrix.push({
					color: riskColors[i * j - 1],
					quantity: risks
						? risks.filter(
								(x) =>
									x.state !== 3 &&
									x.probability === i &&
									x.impact === j &&
									(x.phaseId === null ||
										(phases && phases[activePhase] && x.phaseId === phases[activePhase].id))
						  ).length
						: 0
				});
			}
		}
	}

	let phaseRows: any = [];
	$: if (project && risks && phases && phases[activePhase]) {
		phaseRows = risks
			.filter((x) => x.phaseId === phases[activePhase].id)
			.map((x) => ({
				id: x.id,
				name: x.name,
				category: x.category,
				risk: risksValues[x.impact * x.probability - 1],
				creator: x.ownerId,
				state: states[x.state]
			}));
	}
	let phaseSelected: Array<string> = [];
	let phaseFiltered: Array<string> = [];
	let phasePage: number = 1;
	let activePhase: number = 0;

	let globalRows: any = [];
	$: if (project && risks) {
		globalRows = risks
			.filter((x) => x.phaseId === null)
			.map((x) => ({
				id: x.id,
				name: x.name,
				category: x.category,
				risk: risksValues[x.impact * x.probability - 1],
				creator: x.ownerId,
				state: states[x.state]
			}));
	}
	let globalSelected: Array<string> = [];
	let globalFiltered: Array<string> = [];
	let globalPage: number = 1;
	let pageSize: number = 10;

	let boxes: Array<ComboBox> = [];
	let comboParticip: any;
	let newParticip: string = "";
	let comboParticipants: Array<ComboBoxItem>;
	$: {
		if (employees) {
			comboParticipants = [];
			employees
				.filter(
					(x) =>
						(!participants ||
							(participants && !participants.map((x) => x.email).includes(x.email))) &&
						x.name.includes(newParticip)
				)
				.forEach((x) => comboParticipants.push({ id: x.id, text: x.email }));
		}
	}

	async function addParticipant(): Promise<void> {
		const newEmp = employees.filter((x) => x.email === newParticip).pop();
		if (newEmp && !sending) {
			sending = true;
			if (
				await postData(`${getTarget($page.url.origin)}/projects/assignEmployee`, {
					projectId: project.id,
					employeeId: newEmp.id
				})
			) {
				participants.push(newEmp);
				comboParticip.clear();
				participants = participants;
				notification.kind = "success";
				notification.title = "Success:";
				notification.msg = "User added successfully!";
			} else {
				notification.kind = "error";
				notification.title = "Error:";
				notification.msg = "Unable to add new participant!";
			}
			sending = false;
		}
	}

	async function removeParticipant(participant: Employee): Promise<void> {
		if (
			await deleteData(
				`${getTarget($page.url.origin)}/projects/assignEmployee/${project.id}/${participant.id}`
			)
		) {
			participants = participants.filter((x) => x.id !== participant.id);
			notification.kind = "success";
			notification.title = "Success:";
			notification.msg = "User removed successfully!";
		} else {
			notification.kind = "error";
			notification.title = "Error:";
			notification.msg = "Unable to remove praticipant!";
		}
	}

	async function changeState(): Promise<void> {
		const isoString = new Date().toISOString();
		const dateString = isoString.slice(0, 10);
		const result = dateString + "T00:00:00.000+00:00";
		if (
			await putData(`${getTarget($page.url.origin)}/projects`, {
				...project,
				endDate: !project.isFinished ? result : null,
				isFinished: !project.isFinished
			})
		) {
			project.endDate = result;
			project.isFinished = !project.isFinished;
			notification.kind = "success";
			notification.title = "Success:";
			notification.msg = "Project state changed successfully!";
		} else {
			notification.kind = "error";
			notification.title = "Error:";
			notification.msg = "Unable to change project state!";
		}
	}

	let openPhase: boolean = false;
	let newPhase: Phase = Object.assign({}, newPhaseObj);
	let formWarn: boolean = false;
	let sending: boolean = false;
	$: {
		if (!openPhase) {
			newPhase = Object.assign({}, newPhaseObj);
			formWarn = false;
		}
	}

	const isDateFstLowerSnd = (fst: string, snd: string) =>
		new Date(fst).getTime() < new Date(snd).getTime();

	async function addPhase(): Promise<void> {
		if (phases.length > 0) {
			newPhase.startDate = phases.at(-1)!.endDate;
		}
		formWarn =
			newPhase.name === "" ||
			newPhase.startDate === "" ||
			newPhase.endDate === "" ||
			isDateFstLowerSnd(newPhase.endDate, newPhase.startDate);

		if (!formWarn && !sending) {
			sending = true;
			newPhase.startDate = new Date(newPhase.startDate).toISOString();
			newPhase.endDate = new Date(newPhase.endDate).toISOString();
			const data = await postData(`${getTarget($page.url.origin)}/phases`, {
				name: newPhase.name,
				startDate: newPhase.startDate,
				endDate: newPhase.endDate,
				isFinished: newPhase.isFinished,
				projectId: project.id
			});
			if (data !== "") {
				newPhase.id = data;
				phases.push(newPhase);
				openPhase = false;
				notification.kind = "success";
				notification.title = "Success:";
				notification.msg = "Phase added successfully!";
				phases = phases;
			} else {
				notification.kind = "error";
				notification.title = "Error:";
				notification.msg = "Unable to add new phase!";
			}
			sending = false;
		}
	}

	async function changePhaseState(): Promise<void> {
		if (
			await putData(`${getTarget($page.url.origin)}/phases`, {
				...phases[activePhase],
				projectId: project.id,
				isFinished: !phases[activePhase].isFinished
			})
		) {
			phases[activePhase].isFinished = !phases[activePhase].isFinished;
			notification.kind = "success";
			notification.title = "Success:";
			notification.msg = "Phase state changed successfully!";
		} else {
			notification.kind = "error";
			notification.title = "Error:";
			notification.msg = "Unable to change phase state!";
		}
	}

	async function removePhase(): Promise<void> {
		if (await deleteData(`${getTarget($page.url.origin)}/phases/${phases[activePhase].id}`)) {
			phases = phases.filter((x) => x.id !== phases[activePhase].id);
			activePhase = activePhase > 0 ? activePhase - 1 : 0;
			notification.kind = "success";
			notification.title = "Success:";
			notification.msg = "Phase removed successfully!";
		} else {
			notification.kind = "error";
			notification.title = "Error:";
			notification.msg = "Unable to remove phase!";
		}
	}

	let newRisk: Risk;
	let newOwner: string = "";
	let selectedTemp: string = "";
	let openRisk: boolean = false;
	let isGlobal: boolean = false;
	$: {
		if (!openRisk) {
			newRisk = Object.assign({}, newRiskObj);
			newRisk.vulnerabilities = [];
			newRisk = newRisk;
			boxes.forEach((x) => x.clear());
			selectedTemp = "";
			newOwner = "";
			formWarn = false;
		}
	}

	async function addRisk(): Promise<void> {
		formWarn = false;
		let owner = participants.find((x) => x.email === newOwner);
		if (!owner) {
			formWarn = true;
			return;
		}
		newRisk.ownerId = owner.id ? owner.id : null;
		Object.getOwnPropertyNames(newRisk)
			.filter(
				(x) =>
					x !== "id" &&
					x !== "itemId" &&
					x !== "description" &&
					x !== "riskValue" &&
					x !== "phaseId" &&
					x !== "createDate" &&
					x !== "lastUpdateDate"
			)
			.forEach((property) => {
				const value = newRisk[property as keyof Template];
				if (value === "" || value === -1 || (typeof value === "object" && value.length === 0)) {
					formWarn = true;
				}
			});
		if (!formWarn && !sending) {
			sending = true;
			const temp = Object.assign({}, newRisk);
			newRisk = Object.assign({}, newRiskObj);
			if (temp.id !== "") {
				if (
					await putData(`${getTarget($page.url.origin)}/risks`, {
						...temp,
						projectId: project.id,
						createDate: new Date(),
						lastUpdateDate: new Date()
					})
				) {
					const index = risks.findIndex((x) => x.id === temp.id);
					risks[index] = temp;
					risks = risks;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Risk updated successfully!";
				} else {
					newRisk = Object.assign({}, temp);
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to update risk!";
				}
			} else {
				temp.riskValue = temp.impact * temp.probability;
				temp.phaseId = !isGlobal ? phases[activePhase].id : null;
				temp.createDate = new Date().toLocaleString();
				temp.lastUpdateDate = new Date().toLocaleString();
				const data = await postData(`${getTarget($page.url.origin)}/risks`, {
					...temp,
					projectId: project.id,
					id: null,
					createDate: new Date(),
					lastUpdateDate: new Date()
				});
				if (data !== "") {
					temp.id = data;
					risks.push(temp);
					risks = risks;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Risk added successfully!";
				} else {
					newRisk = Object.assign({}, temp);
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to create risk!";
				}
			}
			sending = false;
			openRisk = false;
		}
	}

	function fillTemplate() {
		if (selectedTemp === "") {
			newRisk = Object.assign({}, newRiskObj);
		} else {
			newRisk = Object.assign({}, templates.filter((x) => x.id === selectedTemp)[0] as Risk);
			newRisk.id = "";
		}
	}

	async function removeRisk(ids: Array<string>): Promise<void> {
		for (var id of ids) {
			if (await deleteData(`${getTarget($page.url.origin)}/risks/${id}`)) {
				risks = risks.filter((x) => id !== x.id);
			}
		}
		phaseSelected = [];
		globalSelected = [];
	}

	let openOpor: boolean = false;
	let newOpor: Opportunity = Object.assign({}, newOportObj);
	let oporSelected: Array<string> = [];
	let oporFiltered: Array<string> = [];
	let oporPage: number = 1;
	let oporRows: any;
	$: {
		if (opportunities.length > 0) {
			oporRows = opportunities.map((x) => ({
				id: x.id,
				message: x.message,
				priority: x.priority,
				solved: x.isSolved ? "Solved" : "Unsolved"
			}));
		} else {
			oporRows = [];
		}
	}

	$: {
		if (!openOpor) {
			newOpor = Object.assign({}, newOportObj);
			formWarn = false;
		}
	}

	async function addOpor(): Promise<void> {
		formWarn = newOpor.message === "" || newOpor.priority === "";
		if (!formWarn && !sending) {
			sending = true;
			if (newOpor.id !== "") {
				if (
					await putData(`${getTarget($page.url.origin)}/opportunities`, {
						id: newOpor.id,
						message: newOpor.message,
						priority: newOpor.priority,
						isSolved: newOpor.isSolved,
						projectId: project.id
					})
				) {
					const index = opportunities.findIndex((x) => x.id === newOpor.id);
					opportunities[index] = newOpor;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Opportunity updated successfully!";
				} else {
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to update opportunity!";
				}
			} else {
				const data = await postData(`${getTarget($page.url.origin)}/opportunities`, {
					message: newOpor.message,
					priority: newOpor.priority,
					isSolved: newOpor.isSolved,
					projectId: project.id
				});
				if (data !== "") {
					newOpor.id = data;
					opportunities.push(newOpor);
					opportunities = opportunities;
					notification.kind = "success";
					notification.title = "Success:";
					notification.msg = "Opportunity added successfully!";
				} else {
					notification.kind = "error";
					notification.title = "Error:";
					notification.msg = "Unable to create opportunity!";
				}
			}
			sending = false;
			openOpor = false;
		}
	}

	async function changeOporState(opportunity: any): Promise<void> {
		if (
			await putData(`${getTarget($page.url.origin)}/opportunities`, {
				...opportunity,
				isSolved: !opportunity.isSolved,
				projectId: project.id
			})
		) {
			const index = opportunities.findIndex((x) => x.id === opportunity.id);
			opportunities[index].isSolved = !opportunity.isSolved;
			notification.kind = "success";
			notification.title = "Success:";
			notification.msg = "Opportunity state changed successfully!";
		} else {
			notification.kind = "error";
			notification.title = "Error:";
			notification.msg = "Unable to change opportunity state!";
		}
	}

	async function removeOpor(ids: Array<string>): Promise<void> {
		for (var id of ids) {
			if (await deleteData(`${getTarget($page.url.origin)}/opportunities/${id}`)) {
				opportunities = opportunities.filter((x) => id !== x.id);
			}
		}
		oporSelected = [];
	}
</script>

{#if project}
	<div class="flex flex-col gap-5 mb-10">
		<div class="flex flex-row gap-5">
			<div class="flex flex-col gap-5 flex-grow">
				<div class="text-4xl text-center font-semibold pb-5">{project.name}</div>
				<div class="flex flex-row shadow-lg">
					{#each phases as phase, index}
						<button
							class="border-neutral-800 border-solid flex-grow w-full text-white"
							class:border-r-2={phases.lastIndexOf(phase) !== phases.length - 1}
							on:click={() => (activePhase = index)}
						>
							<p
								class="p-5 text-center transition-colors"
								class:bg-blue-600={index === activePhase}
								class:bg-blue-300={!phase.isFinished}
								class:bg-green-300={phase.isFinished}
								class:bg-green-600={phase.isFinished && index === activePhase}
							>
								{phase.name}
							</p>
						</button>
					{/each}
				</div>
				<div class="2xl:w-3/5 lg:w-4/5 m-auto mb-10">
					<p class="text-center font-bold text-2xl pb-2">Consequence</p>
					<div class="relative">
						<p class="text-center font-bold text-2xl -rotate-90 absolute top-1/2 -left-28">
							Likelihood
						</p>
						<div class="grid grid-cols-6 bg-white shadow-lg">
							<div class=" text-center pt-2 pb-2" />
							{#each impacts as imp, i}
								<div class="border-l-2 border-dashed border-neutral-800 text-center pt-2 pb-2">
									<p class="py-5">{imp}</p>
								</div>
							{/each}
							{#each riskMatrix as risk, i}
								{#if i % 5 == 0}
									<div class="border-t-2 border-dashed border-neutral-800 text-center flex">
										<p class="self-center w-full px-2">{probabilities[4 - i / 5]}</p>
									</div>
								{/if}
								<div
									class={"border-t-2 border-l-2 border-solid border-neutral-800 p-8 text-center text-xl " +
										risk.color}
								>
									{risk.quantity}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				{#if project.projectManager === sessionStorage.email}
					<IconButton
						title={project.isFinished ? "Restore project" : "Finish project"}
						icon={project.isFinished ? "squareChecked" : "square"}
						color={project.isFinished ? "danger" : "primary"}
						on:click={() => changeState()}
						disabled={phases.length === 0 || phases.map((x) => x.isFinished).includes(false)}
					/>
				{/if}
				<div class="w-56 bg-white rounded flex flex-col gap-1 shadow">
					<h4 class="pt-3 px-3 font-semibold">Participants:</h4>
					<div class="flex flex-col gap-1 px-3 overflow-y-scroll h-80">
						{#each participants as participant}
							<button
								class="flex flex-row gap-1 rounded py-1 pl-1 place-items-center"
								class:hover:bg-red-500={project.projectManager === sessionStorage.email &&
									!project.isFinished &&
									participant.email !== sessionStorage.email}
								disabled={project.projectManager !== sessionStorage.email ||
									project.isFinished ||
									participant.email === sessionStorage.email}
								on:click={() => removeParticipant(participant)}
							>
								{#if project.projectManager === sessionStorage.email && !project.isFinished && participant.email !== sessionStorage.email}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-2">
										<path
											d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
										/>
									</svg>
								{/if}
								<div class="text-xs text-black">{participant.name}</div>
							</button>
						{/each}
					</div>
					{#if project.projectManager === sessionStorage.email}
						<div class="w-42 text-sm flex flex-col gap-2 px-3 pt-1 pb-3">
							<ComboBox
								size="sm"
								bind:value={newParticip}
								bind:this={comboParticip}
								placeholder="Enter name"
								type="text"
								items={comboParticipants}
							/>
							<IconButton
								title="Add participant"
								icon="plus"
								color="primary"
								disabled={project.isFinished}
								on:click={() => addParticipant()}
							/>
						</div>
					{/if}
				</div>
				{#if project.projectManager === sessionStorage.email}
					<IconButton
						title="Add phase"
						icon="plus"
						color="primary"
						disabled={project.isFinished}
						on:click={() => (openPhase = true)}
					/>
					{#if phases[activePhase]}
						<IconButton
							title={phases[activePhase].isFinished ? "Re-open phase" : "Finish phase"}
							icon={phases[activePhase].isFinished ? "squareChecked" : "square"}
							color={phases[activePhase].isFinished ? "danger" : "primary"}
							disabled={project.isFinished ||
								new Date().getTime() < new Date(phases[activePhase].endDate).getTime()}
							on:click={() => changePhaseState()}
						/>
						<IconButton
							title="Remove phase"
							icon="trashcan"
							color="primary"
							disabled={project.isFinished}
							on:click={() => removePhase()}
						/>
					{/if}
				{/if}
			</div>
		</div>
		{#if opportunities}
			<ProjectDataTable
				title="Project opportunities"
				desc=""
				bind:selected={oporSelected}
				bind:filtered={oporFiltered}
				headers={[
					{ key: "message", value: "Message" },
					{ key: "priority", value: "Priority" },
					{ key: "solved", value: "Solved" },
					{ key: "overflow", empty: true }
				]}
				bind:rows={oporRows}
				{pageSize}
				bind:page={oporPage}
			>
				<svelte:fragment slot="actions">
					{#if !project.isFinished && project.projectManager === sessionStorage.email}
						<ActionsDataTable
							deleteActive={oporSelected.length > 0}
							bind:open={openOpor}
							on:click={() => removeOpor(oporSelected)}
						/>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="overflow" let:row>
					{#if project.projectManager === sessionStorage.email}
						<OverflowMenu flipped>
							<OverflowMenuItem
								text="Edit"
								on:click={() => {
									newOpor = Object.assign(
										{},
										opportunities.find((x) => x.id === row.id)
									);
									openOpor = true;
								}}
							/>
							<OverflowMenuItem text="Remove" on:click={() => removeOpor([row.id])} />
							{#if !opportunities.find((x) => x.id === row.id)?.isSolved}
								<OverflowMenuItem text="Change state" on:click={() => changeOporState(row)} />
							{/if}
						</OverflowMenu>
					{/if}
				</svelte:fragment>
			</ProjectDataTable>
		{/if}
		{#if phases[activePhase]}
			<ProjectDataTable
				title={`${phases[activePhase].name} phase risks`}
				desc="These risks only affect selected phase"
				bind:selected={phaseSelected}
				bind:filtered={phaseFiltered}
				headers={[
					{ key: "name", value: "Name" },
					{ key: "category", value: "Category" },
					{ key: "risk", value: "Risk" },
					{ key: "creator", value: "Creator" },
					{ key: "state", value: "State" },
					{ key: "overflow", empty: true }
				]}
				bind:rows={phaseRows}
				{pageSize}
				bind:page={phasePage}
			>
				<svelte:fragment slot="actions">
					{#if !project.isFinished && project.projectManager === sessionStorage.email}
						<ActionsDataTable
							deleteActive={phaseSelected.length > 0}
							bind:open={openRisk}
							bind:riskGlobal={isGlobal}
							on:click={() => removeRisk(phaseSelected)}
						/>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="overflow" let:row>
					{#if project.projectManager === sessionStorage.email}
						<OverflowMenu flipped>
							<OverflowMenuItem
								text="Edit"
								on:click={() => {
									newRisk = Object.assign(
										{},
										risks.find((x) => x.id === row.id)
									);
									newOwner = newRisk.ownerId ? newRisk.ownerId : "";
									isGlobal = false;
									openRisk = true;
								}}
							/>
							<OverflowMenuItem text="Remove" on:click={() => removeRisk([row.id])} />
						</OverflowMenu>
					{/if}
				</svelte:fragment>
			</ProjectDataTable>
		{/if}

		<ProjectDataTable
			title="Global risks"
			desc="These risks affect all of the project phases"
			bind:selected={globalSelected}
			bind:filtered={globalFiltered}
			headers={[
				{ key: "name", value: "Name" },
				{ key: "category", value: "Category" },
				{ key: "risk", value: "Risk" },
				{ key: "creator", value: "Creator" },
				{ key: "state", value: "State" },
				{ key: "overflow", empty: true }
			]}
			bind:rows={globalRows}
			{pageSize}
			bind:page={globalPage}
		>
			<svelte:fragment slot="actions">
				{#if !project.isFinished && project.projectManager === sessionStorage.email}
					<ActionsDataTable
						deleteActive={globalSelected.length > 0}
						bind:open={openRisk}
						riskFlag={true}
						bind:riskGlobal={isGlobal}
						on:click={() => removeRisk(globalSelected)}
					/>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="overflow" let:row>
				{#if project.projectManager === sessionStorage.email}
					<OverflowMenu flipped>
						<OverflowMenuItem
							text="Edit"
							on:click={() => {
								newRisk = Object.assign(
									{},
									risks.find((x) => x.id === row.id)
								);
								newOwner = newRisk.ownerId ? newRisk.ownerId : "";
								isGlobal = true;
								openRisk = true;
							}}
						/>
						<OverflowMenuItem text="Remove" on:click={() => removeRisk([row.id])} />
					</OverflowMenu>
				{/if}
			</svelte:fragment>
		</ProjectDataTable>
	</div>
{/if}

<ModalLayout bind:open={openPhase} on:formSubmit={() => addPhase()} heading={"Add new phase"}>
	<Form>
		<FormGroup>
			<div class="flex flex-col gap-3">
				<TextInput
					required={true}
					labelText="Name (required)"
					placeholder="Enter phase name"
					type="text"
					bind:value={newPhase.name}
					invalidText="Enter valid name"
					invalid={formWarn && newPhase.name === ""}
				/>
				<div class="flex flex-row justify-between">
					<div>
						<DatePicker datePickerType="single" dateFormat="Y-m-d" bind:value={newPhase.startDate}>
							<DatePickerInput
								disabled={phases.length > 0}
								labelText="Phase start date"
								placeholder={phases.length > 0
									? new Date(phases.at(-1).endDate).toLocaleDateString()
									: "mm/dd/yyyy"}
								invalid={formWarn && newPhase.startDate === "" && !(phases.length > 0)}
								invalidText={"Invalid start date!"}
							/>
						</DatePicker>
					</div>
					<div>
						<DatePicker datePickerType="single" dateFormat="Y-m-d" bind:value={newPhase.endDate}>
							<DatePickerInput
								labelText="End date"
								placeholder="mm/dd/yyyy"
								invalid={formWarn &&
									(newPhase.endDate === "" ||
										(phases.length === 0 &&
											isDateFstLowerSnd(newPhase.endDate, newPhase.startDate)) ||
										(phases.length > 0 &&
											isDateFstLowerSnd(newPhase.endDate, phases.at(-1).endDate)))}
								invalidText={"Invalid end date!"}
							/>
						</DatePicker>
					</div>
				</div>
			</div>
		</FormGroup>
	</Form>
</ModalLayout>

<ModalLayout bind:open={openRisk} on:formSubmit={() => addRisk()} heading={"Add new risk"}>
	<div class="flex flex-col gap-5">
		<select
			class="text-md bg-neutral-100 w-full p-4 rounded"
			bind:value={selectedTemp}
			on:change={() => fillTemplate()}
		>
			<option value="">No template</option>
			{#each templates as template}
				<option value={template.id}>{template.name}</option>
			{/each}
		</select>
		<RiskModal bind:template={newRisk} bind:formWarn bind:boxes>
			<Select
				labelText="Owner (required)"
				bind:selected={newOwner}
				invalidText="Choose one of the options"
				invalid={formWarn && newOwner === ""}
			>
				<SelectItem value="" text="Select risk owner" hidden />
				{#each participants as participant}
					<SelectItem value={participant.email} text={participant.name} />
				{/each}
			</Select>
		</RiskModal>
	</div>
</ModalLayout>

<ModalLayout bind:open={openOpor} on:formSubmit={() => addOpor()} heading={"Add new opportunity"}>
	<TextInput
		required={true}
		labelText="Message (required)"
		placeholder="Enter opportunity message"
		type="text"
		bind:value={newOpor.message}
		invalidText="Enter valid name"
		invalid={formWarn && newOpor.message === ""}
	/>
	<Select
		labelText="Priority (required)"
		bind:selected={newOpor.priority}
		invalidText="Choose one of the options"
		invalid={formWarn && newOpor.priority === ""}
	>
		<SelectItem value="" text="Select priority" hidden />
		{#each oporPrios as priority}
			<SelectItem value={priority} text={priority} />
		{/each}
	</Select>
</ModalLayout>

<Snackbar bind:notification />
