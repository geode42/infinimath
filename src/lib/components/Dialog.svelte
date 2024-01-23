<script lang=ts>
	export let dialog: HTMLDialogElement
	let dialogInner: HTMLDivElement
</script>

<svelte:document on:mousedown={e => {const pos = dialogInner.getBoundingClientRect(); if (e.clientX < pos.left || e.clientX > pos.right || e.clientY < pos.top || e.clientY > pos.bottom) dialog.close()}} />

<dialog bind:this={dialog} on:close>
	<div class='dialog-inner' bind:this={dialogInner}>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		border: none;
		border-radius: 1.2rem;
		padding: 0;
		position: absolute;
		top: 30svh;
		margin-block: 0;
		/* width: 20rem; */
		/* height: 50svh; */
	}

	dialog::backdrop {
		/* background: #0002 */
		/* backdrop-filter: blur(20px); */
	}

	/* .dialog-inner {

	} */
</style>