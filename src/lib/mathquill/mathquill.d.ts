// why have i done this it's 3am and i have school tomorrow

enum MathQuillDirection {
	left = -1,
	right = 1
}

type MathQuillConfig = {
	/** If `spaceBehavesLikeTab` is true the keystrokes `{Shift-,}Spacebar` will behave like `{Shift-,}Tab` escaping from the current block (as opposed to the default behavior of inserting a Space character). */
	spaceBehavesLikeTab?: boolean,
	/** This allows you to change the way the left and right keys move the cursor when there are items of different height, like fractions.
	 * 
	 * By default, the Left and Right keys move the cursor through all possible cursor positions in a particular order: right into a fraction puts the cursor at the left end of the numerator, right out of the numerator puts the cursor at the left end of the denominator, and right out of the denominator puts the cursor to the right of the fraction. Symmetrically, left into a fraction puts the cursor at the right end of the denominator, etc.
	 * 
	 * If instead you want right to always visually go right, and left to always go visually left, you can set `leftRightIntoCmdGoes` to `'up'` or `'down'` so that left and right go up or down (respectively) into commands. For example, `'up'` means that left into a fraction goes up into the numerator and right out of the numerator skips the denominator and puts the cursor to the right of the fraction. This behavior can be seen in the Desmos calculator. If this property is set to `'down'` instead, the numerator is harder to navigate to, like in the Mac OS X built-in app Grapher. */
	leftRightIntoCmdGoes?: 'up' | 'down',
	/** If `restrictMismatchedBrackets` is true then you can type `[a,b)` and `(a,b]`, but if you try typing `[x}` or `\langle x|`, you'll get `[{x}]` or `\langle|x|\rangle` instead. This lets you type `(|x|+1)` normally; otherwise, you'd get `\left( \right| x \left| + 1 \right)`. */
	restrictMismatchedBrackets?: boolean,
	/** If `sumStartsWithNEquals` is true then when you type `\sum`, `\prod`, or `\coprod`, the lower limit starts out with `n=`, e.g. you get the LaTeX `\sum_{n=}^{ }`, rather than empty by default. */
	sumStartsWithNEquals?: boolean,
	/** `supSubsRequireOperand` disables typing of superscripts and subscripts when there's nothing to the left of the cursor to be exponentiated or subscripted. Prevents the especially confusing typo `x^^2`, which looks much like `x^2`. */
	supSubsRequireOperand?: boolean,
	/** `charsThatBreakOutOfSupSub` takes a string of the chars that when typed, "break out" of superscripts and subscripts.
	 * 
	 * Normally, to get out of a superscript or subscript, a user has to navigate out of it with the directional keys, a mouse click, tab, or Space if `spaceBehavesLikeTab` is true. For example, typing `x^2n+y` normally results in the LaTeX `x^{2n+y}`. If you wanted to get the LaTeX `x^{2n}+y`, the user would have to manually move the cursor out of the exponent.
	 * 
	 * If this option was set to `'+-'`, `+` and `-` would "break out" of the exponent. This doesn't apply to the first character in a superscript or subscript, so typing `x^-6` still results in `x^{-6}`. The downside to setting this option is that in order to type `x^{n+m}`, a workaround like typing `x^(n+m` and then deleting the `(` is required. */
	charsThatBreakOutOfSupSub?: string,
	autoSubscriptNumerals?: boolean,
	/** `autoCommands` defines the set of commands automatically rendered by just typing the letters without typing a backslash first.
	 * 
	 * This takes a string formatted as a space-delimited list of LaTeX commands. Each LaTeX command must be at least letters only with a minimum length of 2 characters.
	 * 
	 * For example, with `autoCommands` set to `'pi theta'`, the word 'pi' automatically converts to the pi symbol and the word 'theta' automatically converts to the theta symbol. */
	autoCommands?: string,
	/** `autoOperatorNames` overrides the set of operator names that automatically become non-italicized when typing the letters without typing a backslash first, like `sin`, `log`, etc.
	 * 
	 * This defaults to the LaTeX built-in operator names ([Section 3.17 of the Short Math Guide](http://tinyurl.com/jm9okjc)) with additional trig operators like `sech`, `arcsec`, `arsinh`, etc. If you want some of these italicized after setting this property, you will have to add them to the list.
	 * 
	 * Just like [`autoCommands`](#autocommands) above, this takes a string formatted as a space-delimited list of LaTeX commands. */
	autoOperatorNames?: string,
	/** `maxDepth` specifies the maximum number of nested MathBlocks. When `maxDepth` is set to 1, the user can type simple math symbols directly into the editor but not into nested MathBlocks, e.g. the numerator and denominator of a fraction.
	 * 
	 * Nested content in latex rendered during initialization or pasted into mathquill is truncated to avoid violating `maxDepth`. When `maxDepth` is not set, no depth limit is applied by default. You can also specify a speech-friendly representation of the operator name by supplying the operator name, a `|` and its speech alternative (separate multiple words with a `-`). For example, `'sin|sine cos|cosine tan|tangent sinh|hyperbolic-sine'`. */
	maxDepth?: number,
	/** `substituteTextarea` is a function that creates a focusable DOM element that is called when setting up a math field. Overwriting this may be useful for hacks like suppressing built-in virtual keyboards. It defaults to `<textarea autocorrect=off .../>`.
	 * 
	 * For example, [Desmos](https://www.desmos.com/calculator) substitutes `<span tabindex=0></span>` on iOS to suppress the built-in virtual keyboard in favor of a custom math keypad that calls the MathQuill API. Unfortunately there's no universal [check for a virtual keyboard](http://stackoverflow.com/q/2593139/362030) or [way to detect a touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/), and even if you could, a touchscreen ≠ virtual keyboard (Windows 8 and ChromeOS devices have both physical keyboards and touchscreens and iOS and Android devices can have Bluetooth keyboards). Desmos currently sniffs the user agent for iOS, so Bluetooth keyboards just don't work in Desmos on iOS. The tradeoffs are up to you. */
	substituteTextarea?: () => HTMLElement,
	/** Handlers are called after a specified event. They are called directly on the `handlers` object passed in, preserving the `this` value, so you can do stuff like:
	 *  ```js
	 *  class MathList {
	 *    constructor () {
	 *      this.maths = [];
	 *      this.el = ...
	 *    };
	 *    add () {
	 *      var math = MQ.MathField($('<span/>')[0], { handlers: this });
	 *      $(math.el()).appendTo(this.el);
	 *      math.data.i = this.maths.length;
	 *      this.maths.push(math);
	 *    };
	 *    moveOutOf (dir, math) {
	 *      var adjacentI = (dir === MQ.L ? math.data.i - 1 : math.data.i + 1);
	 *      var adjacentMath = this.maths[adjacentI];
	 *      if (adjacentMath) adjacentMath.focus().moveToDirEnd(-dir);
	 *    };
	 *    ...
	 *  };
	 *  ```
	 *  It's common to just ignore the last argument, like if the handlers close over the math field:
	 *  ```js
	 *  var latex = '';
	 *  var mathField = MQ.MathField($('#mathfield')[0], {
	 *    handlers: {
	 *      edit: function() { latex = mathField.latex(); },
	 *      enter: function() { submitLatex(latex); }
	 *    }
	 *  });
	 *  ``` */
	handlers?: {
	  edit?: (mathField: MathQuillMathField) => void,
	  upOutOf?: (mathField: MathQuillMathField) => void,
	  moveOutOf?: (dir: MathQuillDirection, mathField: MathQuillMathField) => void
	}
}

interface MathQuillObject {
	revert(): HTMLElement
	reflow(): void
	el(): HTMLElement
	latex(): string
	latex(latex: string): void
}

type MathQuillMathField = MathQuillObject & {
	/** Puts the focus on the editable field */
	focus: () => void,
	/** Removes the focus from the editable field */
	blur: () => void,
	/** Write the given LaTeX at the current cursor position. If the cursor does not have focus, writes to last position the cursor occupied in the editable field.
	 *  ```js
	 * mathField.write(' - 1'); // writes ' - 1' to mathField at the cursor position
	 * ```
	*/
	write: (latex: string) => void,
	/** Enter a LaTeX command at the current cursor position or with the current selection. If the cursor does not have focus, it writes it to last position the cursor occupied in the editable field.
	 *  ```js
	 *  mathField.cmd('\\sqrt'); // writes a square root command at the cursor position
	 *  ```
	*/
	cmd: (latex: string) => void,
	/** Selects the contents (just like on textareas and on inputs) */
	select: () => void,
	/** Clears the selection */
	clearSelect: () => void,
	/** Move the cursor to the left end of the editable field. This is a shorthand for `moveToDirEnd( ??? )`. */
	moveToLeftEnd: () => void,
	/** Move the cursor to the right end of the editable field. This is a shorthand for `moveToDirEnd( ??? )`. */
	moveToRightEnd: () => void,
	/** Moves the cursor to the end of the mathfield in the direction specified.
	 *
	 * The direction can be one of `MQ.L` or `MQ.R`. These are constants, where `MQ.L` === `-MQ.R` and vice versa. This function may be easier to use than `moveToLeftEnd` or `moveToRightEnd` if used in the `moveOutOf` handler.
	 * ```js
	 *  const config = {
	 *  	handlers: {
	 * 			moveOutOf: (direction) => {
	 * 				nextMathFieldOver.movetoDirEnd(-direction);
	 * 			}
	 * 		}
	 * });
	 * ```
	 */
	moveToDirEnd: (direction: MathQuillDirection) => void, // fix
	/** Simulates keystrokes given a string like `"Ctrl-Home Del"`, a whitespace-delimited list of key inputs with optional prefixes.
	 * ```js
	 * mathField.keystroke('Shift-Left'); // Selects character before the current cursor position
     * ```
	 */
	keystroke: (keys: string) => void,
	/**
	 * Simulates typing text, one character at a time from where the cursor currently is. This is supposed to be identical to what would happen if a user were typing the text in.
	 * ```js
	 * // Types part of the demo from mathquill.com without delays between keystrokes
	 * mathField.typedText('x=-b\\pm \\sqrt b^2 -4ac');
	 * ```
	 */
	typedText: (text: string) => void,
	/** Changes the configuration of just this math field */
	config: (newConfig: MathQuillConfig) => void,
	/** Insert a custom embedded element at the given coordinates, where options is an object like:
	 * ```js
	 *  {
	 *  	htmlString: '<span class="custom-embed"></span>',
	 *  	text: () => 'custom_embed',
	 *  	latex: () => '\\customEmbed',
	 *  }
	 * ```
 	 */
	dropEmbedded(pageX: number, pageY: number, options: { htmlString: string, text: () => string, latex: () => string }),
	/** Allows MathQuill to parse custom embedded objects from latex, where `options` is an object like the one defined in `.dropEmbedded()`. This will parse the following latex into the embedded object you defined: `\embed{name}[id]}.` */
	registerEmbed(...args: any): { htmlString: string, text: () => string, latex: () => string },
}

type MathQuillInstance = {
	EditableField: number,
	MathField: (element: HTMLElement, config?: MathQuillConfig) => MathField,
	StaticMath: (element: HTMLElement) => MathQuillObject,
	TextField: any,
	config: (config: any) => void,
}

declare const MathQuill: {
	getInterface: (version: number) => MathQuillInstance
}