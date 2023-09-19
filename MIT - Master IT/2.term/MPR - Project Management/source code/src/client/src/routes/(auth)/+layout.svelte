<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Roles, roles } from "$lib/utils/constants.js";
	import { logout } from "$lib/utils/functions";
	import {
		Header,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
		Content
	} from "carbon-components-svelte";
	import { onMount } from "svelte";

	export let data;
	let isSideNavOpen = false;
	let allow: boolean = false;
	sessionStorage.url = $page.url.origin;
	onMount(async () => {
		sessionStorage.url = $page.url.origin;
		if (data.user === undefined || data.user.email !== sessionStorage.email) {
			sessionStorage.token = "";
			sessionStorage.email = "";
			sessionStorage.user = "";
			goto("/login");
		} else {
			sessionStorage.user = data.user;
			allow = true;
		}
	});
</script>

<Header company="MPR" platformName="Project" bind:isSideNavOpen href="/home">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
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
</Header>

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

<Content>
	{#if allow}
		<slot />
	{/if}
</Content>
