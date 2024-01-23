import { randInt } from "../questionerUtils"

type Options = { factorNumMin: number, factorNumMax: number, factorNumsNegative: boolean }

const questioner: Questioner<Options> = {
	name: 'Factoring',
	slug: 'factoring',
	presets: [
		{
			slug: 'default',
			name: 'Default',
			options: {
				factorNumMin: 1,
				factorNumMax: 7,
				factorNumsNegative: true
			}
		},
	],
	questionGenerator: options => {
		const num1 = randInt(options.factorNumMin, options.factorNumMax)
		const num2 = randInt(options.factorNumMin, options.factorNumMax)

		const negativeNum1 = options.factorNumsNegative ? Math.random() >= 0.5 : false
		const negativeNum2 = options.factorNumsNegative ? Math.random() >= 0.5 : false

		const a = 1
		const b = num1 * (negativeNum1 ? -1 : 1) + num2 * (negativeNum2 ? -1 : 1)
		const c = num1 * (negativeNum1 ? -1 : 1) * num2 * (negativeNum2 ? -1 : 1)

		const getBeforeX = (n: number, options?: { emptyForZero?: boolean, sign?: boolean, keepNumber?: boolean }) => {
			options = {...{ sign: true, keepNumber: false, emptyForZero: true }, ...options}
			if (n == 0 && options.emptyForZero) {
				return ''
			}
			const sign = options.sign ? (n > 0 ? '+' : '-') : ''
			const number = options.keepNumber ? String(Math.abs(n)) : (Math.abs(n) == 1 ? '' : String(Math.abs(n)))

			return sign + number
		}

		const getWithX = (n: number, suffix: string, options?: { emptyForZero?: boolean, sign?: boolean, keepNumber?: boolean }) => {
			const beforeX = getBeforeX(n, options)
			if (!n) return ''
			return beforeX + suffix
		}

		const aWithX = getWithX(a, 'x^2', { sign: false })
		const bWithX = getWithX(b, 'x')
		const cWithX = getWithX(c, '', { keepNumber: true })

		// console.log(a, b, c, aWithX, bWithX, cWithX)

		const answers: { text: string[], latex: string[] } = {
			text: [],
			latex: [],
		}
		const question = `$${aWithX} ${bWithX} ${cWithX}$`

		// Factored
		answers.latex.push(`\\left(x${negativeNum1 ? '-' : '+'}${num1}\\right)\\left(x${negativeNum2 ? '-' : '+'}${num2}\\right)`)
		answers.latex.push(`\\left(x${negativeNum2 ? '-' : '+'}${num2}\\right)\\left(x${negativeNum1 ? '-' : '+'}${num1}\\right)`)
		answers.text.push(`(x${negativeNum1 ? '-' : '+'}${num1})(x${negativeNum2 ? '-' : '+'}${num2})`)
		answers.text.push(`(x${negativeNum2 ? '-' : '+'}${num2})(x${negativeNum1 ? '-' : '+'}${num1})`)

		// Roots
		answers.latex.push(`${negativeNum1 ? '' : '-'}${num1}, ${negativeNum2 ? '' : '-'}${num2}`)
		answers.latex.push(`${negativeNum1 ? '' : '-'}${num1},${negativeNum2 ? '' : '-'}${num2}`)
		answers.latex.push(`${negativeNum2 ? '' : '-'}${num2}, ${negativeNum1 ? '' : '-'}${num1}`)
		answers.latex.push(`${negativeNum2 ? '' : '-'}${num2},${negativeNum1 ? '' : '-'}${num1}`)
		answers.text.push(`${negativeNum1 ? '' : '-'}${num1}, ${negativeNum2 ? '' : '-'}${num2}`)
		answers.text.push(`${negativeNum1 ? '' : '-'}${num1},${negativeNum2 ? '' : '-'}${num2}`)
		answers.text.push(`${negativeNum2 ? '' : '-'}${num2}, ${negativeNum1 ? '' : '-'}${num1}`)
		answers.text.push(`${negativeNum2 ? '' : '-'}${num2},${negativeNum1 ? '' : '-'}${num1}`)

		// In hindsight I'm not sure if this is a valid factor but it's too awesome to leave out
		if (num1 == num2 && negativeNum1 != negativeNum2) {
			answers.latex.push(`\\left(x\\pm${num1}\\right)`)
			answers.latex.push(`x\\pm${num1}`)
			answers.latex.push(`\\pm${num1}`)
			answers.text.push(`(x+-${num1})`)
			answers.text.push(`x+-${num1}`)
			answers.text.push(`+-${num1}`)
		}
		if (num1 == num2 && negativeNum1 == negativeNum2) {
			answers.latex.push(`\\left(x${negativeNum1 ? '-' : '+'}${num1}\\right)^2`)
			answers.text.push(`(x${negativeNum1 ? '-' : '+'}${num1})^2`)
		}

		return { question, answers }
	}
}

export default questioner