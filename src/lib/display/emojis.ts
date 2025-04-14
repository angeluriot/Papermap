export const EMOJI_NAMES = {
	// Smileys
	'🙂': 'slightly-smiling-face',
	'😊': 'smiling-face-with-smiling-eyes',
	'😇': 'smiling-face-with-halo',
	'🥰': 'smiling-face-with-hearts',
	'🤩': 'star-struck',
	'🤑': 'money-mouth-face',
	'🤗': 'hugging-face',
	'🫣': 'face-with-peeking-eye',
	'😐': 'neutral-face',
	'🫥': 'dotted-line-face',
	'🤮': 'face-vomiting',
	'😵': 'dizzy-face',
	'😎': 'smiling-face-with-sunglasses',
	'🫤': 'face-with-diagonal-mouth',
	'☹️': 'frowning-face',
	'😨': 'fearful-face',
	'😠': 'angry-face',
	'💩': 'pile-of-poo',

	// People
	'👍': 'thumbs-up',
	'👎': 'thumbs-down',
	'👀': 'eyes',
	'🙋': 'person-raising-hand',
	'🤷': 'person-shrugging',
	'🧑‍🏫': 'teacher',
	'🧍': 'person-standing',
	'🧑‍🤝‍🧑': 'people-holding-hands',
	'👪': 'family',
	'🧑‍🧑‍🧒‍🧒': 'family-adult-adult-child-child',

	// Animals & Nature
	'🐭': 'mouse-face',

	// Activity
	'🎲': 'game-die',

	// Travel & Places
	'🏠': 'house',

	// Objects
	'⏳': 'hourglass-not-done',
	'🎛️': 'control-knobs',
	'📸': 'camera-with-flash',
	'🔍': 'magnifying-glass-tilted-left',
	'📖': 'open-book',
	'📚': 'books',
	'📃': 'page-with-curl',
	'📑': 'bookmark-tabs',
	'📭': 'open-mailbox-with-lowered-flag',
	'🗂️': 'card-index-dividers',
	'📊': 'bar-chart',
	'🔗': 'link',
	'🧫': 'petri-dish',
	'🔬': 'microscope',

	// Symbols
	'↪️': 'left-arrow-curving-right',
	'↩️': 'right-arrow-curving-left',
}


export function emoji_to_svg(emoji: string): string
{
	const name = EMOJI_NAMES[emoji as keyof typeof EMOJI_NAMES];

	if (name === undefined)
		throw new Error(`Emoji "${emoji}" not found`);

	return `/emojis/${name}.svg`;
}
