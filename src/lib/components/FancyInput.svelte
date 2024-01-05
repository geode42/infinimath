<script lang=ts>
    import { createEventDispatcher } from "svelte";

	export let value = ''
	export const focus = () => {
		inputElement.focus()
	}

	let inputElement: HTMLInputElement
	let inputElementValue = ''

	$: inputElementValue = value

	function updateValue() {
		value = inputElement.value
	}

	const dispatch = createEventDispatcher()
</script>

<input type="text" class="you-see-nothing" bind:value={inputElementValue} bind:this={inputElement} on:input={updateValue} on:input={() => dispatch('input', { value: value })}>

<div class="container">
	{#each value as char}
		<span>{char}</span>
	{/each}
</div>

<style>
	.you-see-nothing {
		/* Take it out of the document flow */
		position: absolute;  
		width: 0;
		height: 0;
		padding: 0;
		border: none;
		/* opacity not necessary but i just wanna' make sure, yk? */
		opacity: 0;
	}

	.container {
		white-space: pre;
	}
</style>