<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { getTarget, postData } from "$lib/utils/functions";
	import { Button, TextInput } from "carbon-components-svelte";

	let email: string;
	let password: string;
	let isInvalid = false;

	async function verifyUser(): Promise<void> {
		const data = await postData(`${getTarget($page.url.origin)}/employees/login`, {
			email: email,
			password: password
		});
		if (data !== "") {
			const verifData = await fetch(`${getTarget($page.url.origin)}/employees/verify`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${data}`
				},
				body: JSON.stringify({ token: data })
			})
				.then((resp) => (resp.ok ? resp.json() : undefined))
				.catch((error) => console.log(error));
			if (verifData !== undefined) {
				sessionStorage.role = verifData.role;
				sessionStorage.email = email;
				sessionStorage.token = data;
				goto("/home");
			}
		} else {
			isInvalid = true;
		}
	}
</script>

<div class="grid w-full h-screen">
	<div class="flex flex-col m-auto mt-40 shadow rounded w-1/2 p-16 gap-7 bg-white">
		<h3>Log in</h3>
		<TextInput
			labelText="E-mail address"
			placeholder="E-mail"
			type="email"
			light
			invalid={isInvalid}
			invalidText={"Invalid credentials"}
			bind:value={email}
		/>
		<TextInput
			labelText="Password"
			placeholder="Password"
			type="password"
			light
			invalidText={""}
			invalid={isInvalid}
			bind:value={password}
		/>
		<div class="flex flex-row-reverse justify-between">
			<Button kind="primary" on:click={() => verifyUser()}>Log in</Button>
		</div>
	</div>
</div>
