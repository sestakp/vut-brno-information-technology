import { getTarget } from "$lib/utils/functions";

export async function load({ fetch }) {
	const fetchEmployees = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/employees`, {
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
		employees: fetchEmployees()
	};
}
