<script lang=ts>
	import FancyInput from "$lib/components/FancyInput.svelte"
	import { onMount } from "svelte"
	import questioners from '$lib/questioner/built-in-questioners'
	import MathAutoRender from "$lib/components/MathAutoRender.svelte"
    import MathInput from "$lib/components/MathInput.svelte"
	import { outClick } from "$lib/actions/outClick"
    import Dialog from "$lib/components/Dialog.svelte"
	import { browser } from "$app/environment"

	let questionerDialog: HTMLDialogElement
	let questionerSearchValue = ''

	let focusTextInput = () => {}
	let focusLatexInput = () => {}
	let questionText = ''

	let answerValue = ''
	
	let answerFormat: QuestionerAnswerFormat = 'latex'

	/* ------------------------------- Questioner ------------------------------- */
	let questionerSlug = browser ? (localStorage.getItem('questioner') || 'factoring') : 'factoring'
	let questioner: Questioner<any> | undefined
	$: questioner = questioners.find(i => i.slug == questionerSlug)

	/* --------------------------------- Preset --------------------------------- */
	// let presetSlug = 'default'
	// let preset: {name: string, slug: string, options: Record<string, unknown>} | undefined
	// $: preset = questioner?.presets.find(i => i.slug == presetSlug)
	
	/* --------------------------------- Options -------------------------------- */
	let options: Record<string, unknown> | undefined
	$: options = questioner?.presets.find(i => i.slug == 'default')?.options

	const answers: QuestionerAnswers = {}

	onMount(() => {
		focusActiveInput()

		setupNewQuestion()
	})

	function setupNewQuestion() {
		if (!questioner) return
		const { question, answers: questionerAnswers } = questioner.questionGenerator(options)
		questionText = question
		Object.assign(answers, questionerAnswers)
		answerValue = ''
	}

	function checkAnswer() {
		if (answerFormat == 'text' || answerFormat == 'latex') {
			if (answers[answerFormat] && answers[answerFormat]?.includes(answerValue)) {
				setupNewQuestion()
			}
		}
	}

	function focusActiveInput() {
		setTimeout(() => {
			switch (answerFormat) {
				case 'text':
					focusTextInput()
					break
				case 'latex':
					focusLatexInput()
					break
			}
		})
	}

	// i don't know why or how this works but it does
	// when you type "+-", this makes it get replaced with a "\\pm"
	let mathQuillLastCtrlSeqTyped = ''
	function mathquillEditPlusMinus(mathField: MathQuillMathField) {
		if (mathQuillLastCtrlSeqTyped == '+' && mathField.__controller.cursor['-1'].ctrlSeq == '-') {
			mathField.keystroke('Backspace Backspace')
			mathField.cmd('\\pm')
		}
		mathQuillLastCtrlSeqTyped = mathField.__controller.cursor['-1'].ctrlSeq
	}
</script>

<svelte:document on:keydown={e => {
	if (!questionerDialog.open && e.key == 'Escape') {
		questionerDialog.showModal()
		questionerSearchValue = ''
		console.log(questioners.filter(i => i.name.toLowerCase().includes(questionerSearchValue.toLowerCase())).toSorted((a, b) => a.name > b.name))
		e.preventDefault()
	}
}}></svelte:document>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:mousedown={focusActiveInput}>
	<div class="question-answer-container">
		<div id="question-wrapper">
			<MathAutoRender>{questionText}</MathAutoRender>
		</div>
		<div class="answer-wrapper">
			{#if answerFormat == 'text'}
				<FancyInput on:input={checkAnswer} bind:focus={focusTextInput} bind:value={answerValue} />
			{:else if answerFormat == 'latex'}
				<MathInput config={{ autoCommands: 'pi theta sqrt sum', autoOperatorNames: 'sin cos tan log', handlers: { edit: mathquillEditPlusMinus } }} on:input={checkAnswer} bind:focus={focusLatexInput} bind:latex={answerValue} />
			{/if}
		</div>
	</div>
</main>

<Dialog bind:dialog={questionerDialog}>
	<input placeholder="Type to search" class='questioner-search' type="search" bind:value={questionerSearchValue}>
	<ul class='questioner-list'>
		{#each questioners.filter(i => i.name.toLowerCase().includes(questionerSearchValue.toLowerCase())).toSorted((a, b) => a.name > b.name) as questioner}
			<li><button on:click={() => {questionerSlug = questioner.slug; setTimeout(setupNewQuestion); questionerDialog.close(); localStorage.setItem('questioner', questioner.slug)}}>{questioner.name}</button></li>
		{/each}
	</ul>
</Dialog>

<style>
	/* I think Symbola looks nicer */
	/* @font-face {
		font-family: STIX;
		src: url('/fonts/STIXTwoText[wght].woff2');
	}

	@font-face {
		font-family: STIX;
		src: url('/fonts/STIXTwoText-Italic[wght].woff2');
		font-style: italic;
	} */

	@font-face {
		font-family: Symbola;
		src: url('/fonts/Symbola.woff2')
	}

	@font-face {
		font-family: Inter;
		src: url('/fonts/InterVariable.woff2');
		font-display: swap;
	}

	@font-face {
		font-family: Inter;
		font-style: italic;
		src: url('/fonts/InterVariable-Italic.woff2');
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-VariableFont_opsz,wght.ttf')
	}

	@font-face {
		font-family: 'DM Sans';
		font-style: italic;
		src: url('/fonts/DMSans-Italic-VariableFont_opsz,wght.ttf')
	}

	.questioner-search {
		border: none;
		outline: none;
		padding: 0.8rem;
		background: #F2F2F2;
	}

	.questioner-list {
		padding: 0;
		margin: 0;
	}

	.questioner-list > li {
		list-style: none;
	}

	.questioner-list > li > button {
		border: none;
		background: none;
		width: 100%;
		height: 100%;
		padding: 0.7rem;
		color: #444;
	}

	.questioner-list > li > button:hover {
		background: #F0F0F0
	}

	:global(:root) {
		font-size: 18px;
		font-family: 'DM Sans';
		font-weight: 600;
	}

	:global(*, *:before, *:before) {
		box-sizing: border-box;

		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	:global(button) {
		cursor: pointer;
	}
	
	:global(body) {
		height: 100svh;
		margin: 0;
	}

	main {
		position: absolute;
		inset: 0;
	}

	.question-answer-container {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		display: flex;
		flex-direction: column;
		gap: 6rem;
		width: 100%;
		align-items: center;
	}

	#question-wrapper {
		font-size: 6rem;
		user-select: none;
	}

	.answer-wrapper {
		font-size: 4rem;
		text-align: center;
		height: 14rem;
	}

	/* -------------------------- Change MathQuill font ------------------------- */
	:global(.mq-math-mode, .mq-math-mode *) {
		font-family: 'Symbola' !important;
		font-weight: 700;
	}

	/* ------------------------ Remove MathQuill borders ------------------------ */
	:global(.mq-editable-field) {
		border: none !important;
		box-shadow: none !important;
	}

	/* -------------------------- Fix MathQuill's sqrt -------------------------- */
	:global(.mq-sqrt-stem) {
		border-top-width: 0.065em !important;
	}

	:global(.mq-sqrt-prefix) {
		transform: none !important;
		scale: 1 1 !important;
		translate: 0.02em -0.066em;
	}

	/* ---- Make MathQuill's fraction bar consistent with font size and KaTeX --- */
	:global(.mq-denominator) {
		border-top-width: 0.06em !important;
	}
</style>