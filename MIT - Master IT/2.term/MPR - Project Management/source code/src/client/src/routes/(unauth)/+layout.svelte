<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Roles, roles } from "$lib/utils/constants";
	import { logout } from "$lib/utils/functions";
	import {
		Header,
		SkipToContent,
		Content,
		SideNavItems,
		SideNavLink,
		SideNav
	} from "carbon-components-svelte";
	import { onMount } from "svelte";

	export let data;
	let isSideNavOpen: boolean = false;
	let mount = false;
	sessionStorage.url = $page.url.origin;
	onMount(() => {
		mount = true;
		sessionStorage.url = $page.url.origin;
		if (data.user !== undefined && data.user.email === sessionStorage.email) {
			sessionStorage.user = data.user;
		} else {
			sessionStorage.token = "";
			sessionStorage.email = "";
			sessionStorage.user = "";
		}
	});
</script>

<Header company="MPR" platformName="Project" bind:isSideNavOpen href="/home">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	{#if $page.route.id !== "/(unauth)/login"}
		{#if sessionStorage.token && sessionStorage.role && sessionStorage.email && sessionStorage.token != "" && sessionStorage.role != "" && sessionStorage.email != ""}
			<div class="flex flex-row-reverse w-full mr-2 place-items-center gap-4">
				<button class="bg-[#0062ff] p-3 rounded hover:ring" on:click={() => logout()}>
					<img class="w-4 h-4" src="/logout.svg" alt="logout" />
				</button>
				<a href={`/profile/${sessionStorage.email}`} class="text-neutral-700">
					<div class="flex flex-col text-right">
						<p class="text-sm text-white">{sessionStorage.email}</p>
						<p class="text-neutral-300 text-xs">{roles[sessionStorage.role]}</p>
					</div>
				</a>
			</div>
		{:else}
			<div class="flex flex-row-reverse w-full -pr-2 place-items-center gap-4">
				<button
					class="flex flex-row gap-4 place-items-center justify-between px-4 py-3 bg-[#0062ff] focus:border-[#0062ff] hover:bg-[#0f4ffe] text-white  transition-colors focus:ring-2 ring-white ring-inset border-2 border-transparent"
					on:click={() => {
						if (sessionStorage.role && sessionStorage.role !== "") {
							logout();
						} else {
							goto("/login");
						}
					}}
				>
					<div>Log-in</div>
					<img class="w-4 h-5" src="/logout.svg" alt="icon" />
				</button>
			</div>
		{/if}
	{/if}
</Header>

{#if mount && sessionStorage.token && sessionStorage.role && sessionStorage.email && sessionStorage.token != "" && sessionStorage.role != "" && sessionStorage.email != ""}
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			{#if sessionStorage.role == Roles.ADMIN}
				<SideNavLink text="Employees" href="/employees" />
			{/if}
			{#if sessionStorage.role == Roles.PROJECTMANAGER || sessionStorage.role == Roles.SUPERMANAGER}
				<SideNavLink text="Projects" href="/projects" />
				<SideNavLink text="Templates" href="/templates" />
			{/if}
		</SideNavItems>
	</SideNav>
{/if}

<Content>
	<slot />
</Content>
