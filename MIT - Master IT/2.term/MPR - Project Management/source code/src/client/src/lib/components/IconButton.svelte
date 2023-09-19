<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let title: string;
	export let icon: string;
	export let color: string = "primary";
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();
	function dispatchClick() {
		dispatch("click", {});
	}
</script>

<button
	class="flex flex-row place-items-center w-full justify-between px-5 py-4 text-white  transition-colors focus:ring-2 ring-white ring-inset border-2 border-transparent"
	class:bg-[#0062ff]={color === "primary" && !disabled}
	class:focus:border-[#0062ff]={color === "primary" && !disabled}
	class:hover:bg-[#0f4ffe]={color === "primary" && !disabled}
	class:bg-neutral-600={color === "secondary" && !disabled}
	class:focus:border-neutral-600={color === "secondary" && !disabled}
	class:hover:bg-neutral-700={color === "secondary" && !disabled}
	class:bg-red-500={color === "danger" && !disabled}
	class:focus:border-red-500={color === "danger" && !disabled}
	class:hover:bg-red-600={color === "danger" && !disabled}
	class:bg-neutral-300={disabled}
	class:hover:bg-neutral-300={disabled}
	{disabled}
	on:click={() => dispatchClick()}
>
	<div>{title}</div>
	<img class="w-4 h-4" src={`/${icon}.svg`} alt="icon" />
</button>
