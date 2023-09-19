import { getTarget } from "$lib/utils/functions.js";

export async function load({ fetch }) {
	const fetchEmployee = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/employees/${sessionStorage.email}`, {
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
		employee: fetchEmployee()
	};
}
