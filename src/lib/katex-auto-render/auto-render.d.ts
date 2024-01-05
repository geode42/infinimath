type KatexAutoRenderOptions = katex.KatexOptions | {
	delimiters?: { left: string, right: string, display: boolean }[],
	ignoredTags?: string[],
	ignoredClasses?: string[],
	errorCallback?: (...any) => any,
	preProcess?: (math: string) => string
}

export default function renderMathInElement(elem: HTMLElement, options?: KatexAutoRenderOptions): void
