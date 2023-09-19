<script>
	import { page } from "$app/stores";
</script>

<h1 class="text-center pt-56 w-full grid place-content-center gap-5">
	An error was encountered when processing your request: <br />
	<strong>{$page.error ? $page.error.message : "Unknown error encountered."}</strong><br /> Please contact
	your administrator for more info.
</h1>
