<script lang=ts>
	import FancyInput from "$lib/components/FancyInput.svelte"
	import { onMount } from "svelte"
	import questioners from '$lib/questioner/built-in-questioners'
	import MathAutoRender from "$lib/components/MathAutoRender.svelte"
    import MathInput from "$lib/components/MathInput.svelte";

	let focusTextInput = () => {}
	let focusLatexInput = () => {}
	let questionText = ''

	let answerValue = ''
	
	let answerFormat: QuestionerAnswerFormat = 'latex'

	/* ------------------------------- Questioner ------------------------------- */
	let questionerSlug = 'log'
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
</script>

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
				<MathInput config={{ autoCommands: 'pi theta sqrt sum', autoOperatorNames: 'sin cos tan log' }} on:input={checkAnswer} bind:focus={focusLatexInput} bind:latex={answerValue} />
			{/if}
		</div>
	</div>
</main>

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