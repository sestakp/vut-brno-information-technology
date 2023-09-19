import { goto } from "$app/navigation";
import { Roles } from "$lib/utils/constants.js";
import { getTarget } from "$lib/utils/functions";

export async function load({ fetch }) {
	const fetchProjects = async () => {
		let path = "";
		if (sessionStorage.role == Roles.PROJECTMANAGER) {
			path = `${getTarget(sessionStorage.url)}/projects/GetByProjectManager/${
				sessionStorage.email
			}`;
		} else if (sessionStorage.role == Roles.SUPERMANAGER) {
			path = `${getTarget(sessionStorage.url)}/projects`;
		} else {
			console.log("asd");
			goto("/login");
			return;
		}
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

	return {
		projects: fetchProjects()
	};
}
