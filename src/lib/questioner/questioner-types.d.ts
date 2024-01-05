type QuestionerPreset = { name: string, slug: string, options: Type }
type QuestionerAnswers = { text?: string[], latex?: string[], multipleChoice?: { correct: string, incorrect: string[] } }

type Questioner<Type extends Record<string, unknown>> = {
	name: string
	slug: string
	presets: QuestionerPreset[]
	questionGenerator: (options: Type) => { question: string, answers: QuestionerAnswers }
}

type QuestionerAnswerFormat = 'text' | 'latex' | 'multipleChoice'