/** Returns a random item from `items` */
export function randomItem<Type>(items: Type[]): Type {
	return items[Math.floor(Math.random() * items.length)]
}

/** Returns the index of a random item from `items` */
export function randomIndex(items: unknown[]): number {
	return Math.floor(Math.random() * items.length)
}

/** Returns a random integer from [0, end) or [start, end) */
export function randRange(end: number): number
export function randRange(start: number, end: number): number
export function randRange(arg1: number, arg2?: number): number {
	if (!arg2) [arg1, arg2] = [0, arg1]
	return Math.floor(Math.random() * (arg2 - arg1) + arg1)
}

/** Returns a random integer from [0, end] or [start, end] */
export function randInt(end: number): number
export function randInt(start: number, end: number): number
export function randInt(arg1: number, arg2?: number): number {
	if (!arg2) [arg1, arg2] = [0, arg1]
	return Math.floor(Math.random() * (arg2 - arg1 + 1) + arg1)
}
