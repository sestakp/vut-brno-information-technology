import { goto } from "$app/navigation";
import { Roles } from "$lib/utils/constants";
import { getTarget } from "$lib/utils/functions";

export async function load({ fetch, params }) {
	const fetchTemplate = async () => {
		console.log(sessionStorage.role);
		let path = "";
		if (sessionStorage.role == Roles.PROJECTMANAGER || sessionStorage.role == Roles.SUPERMANAGER) {
			path = `${getTarget(sessionStorage.url)}/riskTemplates/${params.id}`;
		} else {
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
		template: fetchTemplate()
	};
}
