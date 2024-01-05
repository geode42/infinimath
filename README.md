# infinimath

You can select a questioner to generate infinite math questions for you, and if you know JS they're pretty easy to make yourself!

Here's a template questioner:
```ts
type Options = { /* type definitions for key-value pairs */ }

const questioner: Questioner<Options> = {
	name: '<name>',
	slug: '<internal-name>',
	presets: [
		{  // default preset is required
			slug: 'default',
			name: 'Default',
			options: {
				// key-value-pairs as defined above
			}
		},
		// you can add more presets here
	],
	questionGenerator: options => {
		const question = 'your $\\LaTeX$ here'

		// All answers in these arrays are valid (for their respective input)
		const answers: { text: string[], latex: string[] } = {
			text: [],
			latex: [],
		}

		answers.text.push('2/5')
		answers.latex.push('\\frac{2}{5}')

		return { question, answers }
	}
}

export default questioner
```
for now all the questioners are in `src/questioner/built-in-questioners/`

This website uses SvelteKit+TS for um, idk websiting, KaTeX for question rendering, and MathQuill for the WYSIWYG math input

infinimath is very WIP right now, but thanks for stopping by!
