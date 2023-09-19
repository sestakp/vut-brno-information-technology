import { goto } from "$app/navigation";

export async function getData(path: string): Promise<any> {
	let result = undefined;
	await fetch(path, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${sessionStorage.token}`
		}
	})
		.then((response) => response.json())
		.then((data) => {
			result = data;
		})
		.catch((error) => {
			console.log(error);
		});
	return result;
}

export async function postData(path: string, body: object): Promise<string> {
	const data = await fetch(path, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${sessionStorage.token}`
		},
		body: JSON.stringify(body)
	})
		.then((resp) => resp.text())
		.catch((e) => {
			console.log(e);
		});
	return data ? data : "";
}

export async function putData(path: string, body: object) {
	let result = true;
	await fetch(path, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${sessionStorage.token}`
		},
		body: JSON.stringify(body)
	}).catch((e) => {
		console.log(e);
		result = false;
	});
	return result;
}

export async function deleteData(path: string) {
	let result = true;
	await fetch(path, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${sessionStorage.token}`
		}
	}).catch((e) => {
		console.log(e);
		result = false;
	});
	return result;
}

export function getTarget(url: string): string {
	return process.env.NODE_ENV === "development"
		? "http://172.16.1.1:32785/api-gateway"
		: url + ":32785/api-gateway";
}

export function logout() {
	sessionStorage.token = "";
	sessionStorage.email = "";
	sessionStorage.role = "";
	goto("/home");
	window.location.reload();
}
