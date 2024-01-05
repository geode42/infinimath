<script lang=ts>
	import renderMathInElement from "$lib/katex-auto-render"
    import { onMount } from "svelte";

	let inputTextElement: HTMLDivElement
	let renderOutputElement: HTMLDivElement

	onMount(() => {
		const observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
			renderOutputElement.replaceChildren(inputTextElement.textContent || '')
			renderMathInElement(renderOutputElement, { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}] })
		})
		observer.observe(inputTextElement, { characterData: true, subtree: true })
	})

</script>

<div bind:this={inputTextElement} class='input-text'>
	<slot />
</div>

<div bind:this={renderOutputElement} class='output'></div>

<style>
	@import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');

	.input-text {
		display: none;
	}
</style>