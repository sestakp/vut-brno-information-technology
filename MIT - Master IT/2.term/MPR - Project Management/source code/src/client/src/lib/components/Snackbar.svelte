<script lang="ts">
	import { InlineNotification } from "carbon-components-svelte";

	export let notification: { kind: string; title: string; msg: string };
</script>

<div class="fixed z-50 bottom-20 left-0 w-full grid place-items-center transition-all">
	<div>
		{#if notification.kind === "error"}
			<InlineNotification
				kind="error"
				title={notification.title}
				subtitle={notification.msg}
				timeout={2000}
				on:close={() => (notification.kind = "")}
			/>
		{:else if notification.kind === "success"}
			<InlineNotification
				kind="success"
				title={notification.title}
				subtitle={notification.msg}
				timeout={2000}
				on:close={() => (notification.kind = "")}
			/>
		{/if}
	</div>
</div>
