import { goto } from "$app/navigation";
import { Roles } from "$lib/utils/constants";
import { getTarget } from "$lib/utils/functions";

export async function load({ fetch, params }) {
	let path = "";
	if (sessionStorage.role == Roles.PROJECTMANAGER || sessionStorage.role == Roles.SUPERMANAGER) {
		path = `${getTarget(sessionStorage.url)}/projects/${params.id}`;
	} else {
		goto("/login");
		return;
	}

	const fetchProject = async () => {
		return await fetch(path, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchEmployees = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/employees/getAllManagers`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchTemplates = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/riskTemplates`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchPhases = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/phases/getByProjectId/${params.id}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchRisks = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/risks/getByProjectId/${params.id}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchParticipants = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/projects/getParticipants/${params.id}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	const fetchOpportunities = async () => {
		return await fetch(
			`${getTarget(sessionStorage.url)}/opportunities/getByProjectId/${params.id}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionStorage.token}`
				}
			}
		)
			.then((resp) => resp.json())
			.catch((error) => console.log(error));
	};

	return {
		project: fetchProject(),
		employees: fetchEmployees(),
		templates: fetchTemplates(),
		phases: fetchPhases(),
		risks: fetchRisks(),
		participants: fetchParticipants(),
		opportunities: fetchOpportunities()
	};
}
