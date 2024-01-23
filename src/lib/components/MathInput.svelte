<svelte:head>
	<link rel="stylesheet" href="/mathquill-custom.css">
	<script src="/jquery.js"></script>
	<script src="/mathquill.js"></script>
</svelte:head>

<script lang=ts>
    import { createEventDispatcher, onMount } from "svelte"

	export let latex = ''
	export let mathField: MathQuillMathField | undefined = undefined
	export let config: MathQuillConfig = {}

	export let focus = () => {}
	export let blur = () => {}
	export let write = (latex: string) => {}
	export let cmd = (latex: string) => {}
	export let select = () => {}
	export let clearSelect = () => {}
	export let moveToLeftEnd = () => {}
	export let moveToRightEnd = () => {}
	export let moveToDirEnd = (direction: MathQuillDirection) => {}
	export let keystroke = (keys: string) => {}
	export let typedText = (text: string) => {}
	export let dropEmbedded = (pageX: number, pageY: number, options: { htmlString: string, text: () => string, latex: () => string }) => {}
	export let registerEmbed: (...args: any) => { htmlString: string, text: () => string, latex: () => string } | void = () => {}

	let container: HTMLDivElement
	const dispatch = createEventDispatcher()

	$: mathField?.config(getConfig(config))
	$: if (mathField && latex != mathField.latex()) mathField?.latex(latex)

	function getConfig(config: MathQuillConfig) {
		return {...config, handlers: {
			edit: (mathField) => {
				latex = mathField?.latex() || ''
				if (config.handlers?.edit) config.handlers.edit(mathField)
				dispatch('input')
			},
			upOutOf: (mathField) => {
				if (config.handlers?.upOutOf) config.handlers.upOutOf(mathField)
			},
			moveOutOf: (dir, mathField) => {
				if (config.handlers?.moveOutOf) config.handlers.moveOutOf(dir, mathField)
			},
		}} satisfies MathQuillConfig
	}

	onMount(() => {
		const MQ = MathQuill.getInterface(2)
		mathField = MQ.MathField(container, getConfig(config))

		focus = () => mathField?.focus()
		blur = () => mathField?.blur()
		write = (latex: string) => mathField?.write(latex)
		cmd = (latex: string) => mathField?.cmd(latex)
		select = () => mathField?.select()
		clearSelect = () => mathField?.clearSelect()
		moveToLeftEnd = () => mathField?.moveToLeftEnd()
		moveToRightEnd = () => mathField?.moveToRightEnd()
		moveToDirEnd = (direction: MathQuillDirection) => mathField?.moveToDirEnd(direction)
		keystroke = (keys: string) => mathField?.keystroke(keys)
		typedText = (text: string) => mathField?.typedText(text)
		dropEmbedded = (pageX: number, pageY: number, options: { htmlString: string, text: () => string, latex: () => string }) => mathField?.dropEmbedded(pageX, pageY, options)
		registerEmbed = (...args: any) => mathField?.registerEmbed(...args)
	})
</script>

<div bind:this={container} />