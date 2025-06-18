import { join } from 'path';
import { promises as fs } from 'fs';
import { constants as C } from '$lib/server/utils';


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
	'🤔': 'thinking-face',
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
	'🤏': 'pinching-hand',
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
	'🏆': 'trophy',
	'🎲': 'game-die',
	'🧩': 'puzzle-piece',

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
	'✏️': 'pencil',
	'✒️': 'black-nib',
	'📝': 'memo',
	'🗂️': 'card-index-dividers',
	'📊': 'bar-chart',
	'🔒': 'locked',
	'🗑️': 'wastebasket',
	'🔗': 'link',
	'🧫': 'petri-dish',
	'🔬': 'microscope',
	'💉': 'syringe',
	'💊': 'pill',

	// Symbols
	'➡️': 'right-arrow',
	'⬅️': 'left-arrow',
	'↪️': 'left-arrow-curving-right',
	'↩️': 'right-arrow-curving-left',
}


export async function load_svgs()
{
	let svgs: Record<string, string> = {};

	for (const [emoji, name] of Object.entries(EMOJI_NAMES))
	{
		try
		{
			let svg = await fs.readFile(join(C.LIB_DIR, 'server', 'emojis', 'svgs', `${name}.svg`), 'utf-8');
			svg = svg.replace(/<\?xml[\s\S]*?\?>\s*/g, '');
			svgs[emoji] = svg.slice(0, 5) + 'width="100%" height="100%" ' + svg.slice(5);
		}

		catch (error)
		{
			console.error(`Failed to load SVG for emoji "${emoji}":`, error);
		}
	}

	return svgs;
}
