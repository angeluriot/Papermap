import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';


export const EMOJI_NAMES = {
	// Smileys
	'ðŸ™‚': 'slightly-smiling-face',
	'ðŸ˜Š': 'smiling-face-with-smiling-eyes',
	'ðŸ˜‡': 'smiling-face-with-halo',
	'ðŸ¥°': 'smiling-face-with-hearts',
	'ðŸ¤©': 'star-struck',
	'ðŸ¤‘': 'money-mouth-face',
	'ðŸ¤—': 'hugging-face',
	'ðŸ«£': 'face-with-peeking-eye',
	'ðŸ¤”': 'thinking-face',
	'ðŸ¤': 'zipper-mouth-face',
	'ðŸ˜': 'neutral-face',
	'ðŸ«¥': 'dotted-line-face',
	'ðŸ˜®â€ðŸ’¨': 'face-exhaling',
	'ðŸ˜Œ': 'relieved-face',
	'ðŸ¤®': 'face-vomiting',
	'ðŸ˜µ': 'dizzy-face',
	'ðŸ˜Ž': 'smiling-face-with-sunglasses',
	'ðŸ§': 'face-with-monocle',
	'ðŸ«¤': 'face-with-diagonal-mouth',
	'â˜¹ï¸': 'frowning-face',
	'ðŸ˜¨': 'fearful-face',
	'ðŸ˜ ': 'angry-face',
	'ðŸ’©': 'pile-of-poo',
	'ðŸ¤–': 'robot',

	// People
	'ðŸ¤': 'pinching-hand',
	'ðŸ‘': 'thumbs-up',
	'ðŸ‘Ž': 'thumbs-down',
	'ðŸ‘€': 'eyes',
	'ðŸ™‹': 'person-raising-hand',
	'ðŸ¤·': 'person-shrugging',
	'ðŸ§‘â€ðŸ«': 'teacher',
	'ðŸ§': 'person-standing',
	'ðŸƒâ€âž¡ï¸': 'person-running-facing-right',
	'ðŸ‹ï¸': 'person-lifting-weights',
	'ðŸ§‘â€ðŸ¤â€ðŸ§‘': 'people-holding-hands',
	'ðŸ‘¥': 'busts-in-silhouette',
	'ðŸ‘ª': 'family',
	'ðŸ§‘â€ðŸ§‘â€ðŸ§’â€ðŸ§’': 'family-adult-adult-child-child',
	'ðŸ§‘â€ðŸ§’': 'family-adult-child',

	// Animals & Nature
	'ðŸ­': 'mouse-face',

	// Food & Drink
	'ðŸ¬': 'candy',
	'ðŸ½ï¸': 'fork-and-knife-with-plate',

	// Activity
	'ðŸ†': 'trophy',
	'ðŸŽ²': 'game-die',
	'ðŸ§©': 'puzzle-piece',

	// Travel & Places
	'ðŸŒ': 'globe-showing-europe-africa',
	'ðŸŒ': 'globe-with-meridians',
	'ðŸ ': 'house',
	'ðŸ«': 'school',

	// Objects
	'â³': 'hourglass-not-done',
	'ðŸ§¸': 'teddy-bear',
	'ðŸŽ›ï¸': 'control-knobs',
	'ðŸ“¸': 'camera-with-flash',
	'ðŸ”': 'magnifying-glass-tilted-left',
	'ðŸ“–': 'open-book',
	'ðŸ“š': 'books',
	'ðŸ“ƒ': 'page-with-curl',
	'ðŸ“‘': 'bookmark-tabs',
	'ðŸ“­': 'open-mailbox-with-lowered-flag',
	'âœï¸': 'pencil',
	'âœ’ï¸': 'black-nib',
	'ðŸ“': 'memo',
	'ðŸ—‚ï¸': 'card-index-dividers',
	'ðŸ“Š': 'bar-chart',
	'ðŸ—‘ï¸': 'wastebasket',
	'ðŸ”’': 'locked',
	'âš–ï¸': 'balance-scale',
	'ðŸ”—': 'link',
	'âš—ï¸': 'alembic',
	'ðŸ§ª': 'test-tube',
	'ðŸ§«': 'petri-dish',
	'ðŸ”¬': 'microscope',
	'ðŸ’‰': 'syringe',
	'ðŸ’Š': 'pill',
	'ðŸš¬': 'cigarette',

	// Symbols
	'ðŸ’–': 'sparkling-heart',
	'ðŸ’¨': 'dashing-away',
	'ðŸš»': 'restroom',
	'âž¡ï¸': 'right-arrow',
	'â¬…ï¸': 'left-arrow',
	'â†ªï¸': 'left-arrow-curving-right',
	'â†©ï¸': 'right-arrow-curving-left',
	'ðŸ”€': 'shuffle-tracks-button',
	'ðŸŸ°': 'heavy-equals-sign',
};


export async function load_svgs()
{
	const svgs: Record<string, string> = {};

	for (const [emoji, name] of Object.entries(EMOJI_NAMES))
	{
		try
		{
			let svg = await fs.readFile(join(C.LIB_DIR, 'server', 'emojis', 'svgs', `${name}.svg`), 'utf-8');
			svg = svg.replaceAll(/<\?xml[\S\s]*?\?>\s*/g, '');
			svgs[emoji] = svg.slice(0, 5) + 'width="100%" height="100%" ' + svg.slice(5);
		}

		catch (error)
		{
			console.error(`Failed to load SVG for emoji "${emoji}":`, error);
		}
	}

	return svgs;
}
