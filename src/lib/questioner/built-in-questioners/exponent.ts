import { randomItem } from '../questionerUtils'

type Options = { includeNegativeExponents: boolean, baseOptions: { base: number, powers: number[]}[] }

const questioner: Questioner<Options> = {
	name: 'Exponents',
	slug: 'exponent',
	presets: [
		{
			slug: 'default',
			name: 'Default',
			options: {
				includeNegativeExponents: true,
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
		const baseOption = randomItem(options.baseOptions)
		const base = baseOption.base
		const power = randomItem(baseOption.powers)
	
		const negativePower = options.includeNegativeExponents ? Math.floor(Math.random() * 2) : 0
		
		const question = negativePower ? `$${base}^{-${power}}$` : `$${base}^{${power}}$`
		
		const answers: { text: string[], latex: string[] } = {
			text: [],
			latex: [],
		}
		
		answers.text.push(negativePower ? `1/${Math.pow(base, power)}` : `${Math.pow(base, power)}`)
		answers.latex.push(negativePower ? `\\frac{1}{${Math.pow(base, power)}}` : `${Math.pow(base, power)}`)
		
	
		return { question, answers }
	}
}

export default questioner