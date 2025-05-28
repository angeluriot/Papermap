import type { DataPaper } from '$lib/types/paper';
import type { Edits } from './types';
import type { DataMap } from '$lib/types/map';


export async function edit_map(map: DataMap, edits: Edits): Promise<DataMap>
{
	let papers: DataPaper[] = [];

	for (let i = 0; i < map.papers.length; i++)
	{
		if (edits.deleted.includes(i))
			continue;

		if (edits.edited[`${i}`])
			papers.push(edits.edited[`${i}`]);
		else
			papers.push(map.papers[i]);
	}

	papers = papers.concat(edits.added);
	papers.sort((a, b) => a.year !== b.year ? a.year - b.year : a.title.localeCompare(b.title));
	map.papers = papers;

	return map;
}


export function get_pr_texts(map: DataMap, map_id: string, comment: string | undefined, discord_username: string | undefined, data: Edits)
{
	let title = `Edit "${map.question.short}"`;
	const map_title = `**[${map.question.short}](https://papermap.org/maps/${map_id})**`;
	let description = `This PR makes changes to the map ${map_title} using the web interface.`;

	description += '\n\n## ✏️ Changes';

	const nb_added = data.added.length;
	const nb_edited = Object.values(data.edited).length;
	const nb_deleted = data.deleted.length;

	if (nb_added > 0)
		description += `\n\n* **Add** ${nb_added} paper${nb_added > 1 ? 's' : ''}`;

	if (nb_edited > 0)
		description += `\n\n* **Edit** ${nb_edited} paper${nb_edited > 1 ? 's' : ''}`;

	if (nb_deleted > 0)
		description += `\n\n* **Remove** ${nb_deleted} paper${nb_deleted > 1 ? 's' : ''}`;

	if (comment && comment.trim().length > 0)
		description += '\n\n## 💬 Comment\n' + comment.trim();

	if (discord_username && discord_username.trim().length > 0)
		description += '\n\n## 👤 Discord\n' + '`' + discord_username.trim() + '`';

	return { title, description };
}
