import { randomItem } from '../questionerUtils'
import Fraction from 'fraction.js'

type Options = { baseOptions: { base: number, powers: number[]}[] }

const questioner: Questioner<Options> = {
	name: 'Logarithms',
	slug: 'log',
	presets: [
		{
			slug: 'default',
			name: 'Default',
			options: {
				baseOptions: [
					{
						base: 2,
						powers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
					},
					{
						base: 3,
						powers: [1, 2, 3, 4, 5],
					},
					{
						base: 5,
						powers: [1, 2, 3, 4],
					},
					{
						base: 6,
						powers: [1, 2, 3],
					},
					{
						base: 7,
						powers: [1, 2, 3],
					},
				]
			}
		}
	],
	questionGenerator: options => {
		const option = randomItem(options.baseOptions)
		const baseExponent = randomItem(option.powers)
		const argExponent = randomItem(option.powers)
	
		const base = Math.pow(option.base, baseExponent)
		const arg = Math.pow(option.base, argExponent)

		const fractionalBase = Math.random() >= 0.5
		const fractionalArg = Math.random() >= 0.5

		const negativeAnswer = fractionalBase != fractionalArg

		const fraction = new Fraction(argExponent * (negativeAnswer ? -1 : 1), baseExponent)
	
		const answers: { text: string[], latex: string[] } = {
			text: [],
			latex: [],
		}

		answers.latex.push(fraction.toLatex())
		answers.text.push(fraction.toFraction())

		const question = `$\\log_{${fractionalBase ? `\\frac{1}{${base}}` : base}} ${fractionalArg ? `\\frac{1}{${arg}}` : arg}$`
		
		return {
			question,
			answers,
		}
	}
}

export default questioner