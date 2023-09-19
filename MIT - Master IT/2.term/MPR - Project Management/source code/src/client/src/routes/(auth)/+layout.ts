import { getTarget } from "$lib/utils/functions";

export async function load({ fetch }) {
	const verify = async () => {
		return await fetch(`${getTarget(sessionStorage.url)}/employees/verify`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionStorage.token}`
			},
			body: JSON.stringify({ token: sessionStorage.token })
		})
			.then((resp) => (resp.ok ? resp.json() : undefined))
			.catch((error) => console.log(error));
	};
	return {
		user: verify()
	};
}
