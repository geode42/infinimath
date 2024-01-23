export function outClick(node: HTMLElement) {
	const mousedownHandler = (e: MouseEvent) => {
		console.log('hi')
		const nodePos = node.getBoundingClientRect()
		if (e.clientX < nodePos.left || e.clientX > nodePos.right || e.clientY < nodePos.top || e.clientY > nodePos.bottom ) {
			node.dispatchEvent(new CustomEvent('outclick'))
			console.log('hey')
		}
	}
	document.addEventListener('mousedown', mousedownHandler)

	return {
		destroy() {
			document.removeEventListener('mousedown', mousedownHandler)
		}
	}
}
