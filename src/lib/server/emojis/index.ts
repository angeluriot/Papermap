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
	'🤐': 'zipper-mouth-face',
	'😐': 'neutral-face',
	'🫥': 'dotted-line-face',
	'😮‍💨': 'face-exhaling',
	'😌': 'relieved-face',
	'🤮': 'face-vomiting',
	'😵': 'dizzy-face',
	'😎': 'smiling-face-with-sunglasses',
	'🧐': 'face-with-monocle',
	'🫤': 'face-with-diagonal-mouth',
	'☹️': 'frowning-face',
	'😨': 'fearful-face',
	'😠': 'angry-face',
	'💩': 'pile-of-poo',
	'🤖': 'robot',

	// People
	'🤏': 'pinching-hand',
	'👍': 'thumbs-up',
	'👎': 'thumbs-down',
	'👀': 'eyes',
	'🙋': 'person-raising-hand',
	'🤷': 'person-shrugging',
	'🧑‍🏫': 'teacher',
	'🧍': 'person-standing',
	'🏃‍➡️': 'person-running-facing-right',
	'🏋️': 'person-lifting-weights',
	'🧑‍🤝‍🧑': 'people-holding-hands',
	'👥': 'busts-in-silhouette',
	'👪': 'family',
	'🧑‍🧑‍🧒‍🧒': 'family-adult-adult-child-child',
	'🧑‍🧒': 'family-adult-child',

	// Animals & Nature
	'🐭': 'mouse-face',

	// Food & Drink
	'🍬': 'candy',
	'🍽️': 'fork-and-knife-with-plate',

	// Activity
	'🏆': 'trophy',
	'🎲': 'game-die',
	'🧩': 'puzzle-piece',

	// Travel & Places
	'🌍': 'globe-showing-europe-africa',
	'🌐': 'globe-with-meridians',
	'🏠': 'house',
	'🏫': 'school',

	// Objects
	'⏳': 'hourglass-not-done',
	'🧸': 'teddy-bear',
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
	'🗑️': 'wastebasket',
	'🔒': 'locked',
	'⚖️': 'balance-scale',
	'🔗': 'link',
	'⚗️': 'alembic',
	'🧪': 'test-tube',
	'🧫': 'petri-dish',
	'🔬': 'microscope',
	'💉': 'syringe',
	'💊': 'pill',
	'🚬': 'cigarette',

	// Symbols
	'💖': 'sparkling-heart',
	'💨': 'dashing-away',
	'🚻': 'restroom',
	'➡️': 'right-arrow',
	'⬅️': 'left-arrow',
	'↪️': 'left-arrow-curving-right',
	'↩️': 'right-arrow-curving-left',
	'🔀': 'shuffle-tracks-button',
	'🟰': 'heavy-equals-sign'
}


export async function load_svgs()
{
	const svgs: Record<string, string> = {};

	for (const [emoji, name] of Object.entries(EMOJI_NAMES))
	{
		try
		{
			let svg = await fs.readFile(join(C.LIB_DIR, 'server', 'emojis', 'svgs', `${name}.svg`), 'utf-8');
			svg = svg.replaceAll(/<\?xml[\s\S]*?\?>\s*/g, '');
			svgs[emoji] = svg.slice(0, 5) + 'width="100%" height="100%" ' + svg.slice(5);
		}

		catch (error)
		{
			console.error(`Failed to load SVG for emoji "${emoji}":`, error);
		}
	}

	return svgs;
}
