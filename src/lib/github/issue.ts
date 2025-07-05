export interface NewMapRequest
{
	title: string;
	description?: string;
	papers?: string;
	comment?: string;
	discord_username?: string;
}


export function get_new_map_issue(data: NewMapRequest): { title: string, description: string }
{
	let title = `New map: "${data.title.trim()}"`

	let description = '# 🤔 ' + data.title.trim();

	if (data.description && data.description.trim().length > 0)
		description += '\n' + data.description.trim();

	if (data.papers && data.papers.trim().length > 0)
		description += '\n\n## 📚 Papers\n' + data.papers.trim();

	if (data.comment && data.comment.trim().length > 0)
		description += '\n\n## 💬 Comment\n' + data.comment.trim();

	let discord_username = data.discord_username ? data.discord_username.trim() : null;

	if (discord_username && (discord_username.startsWith('@') || discord_username.startsWith('#')))
		discord_username = discord_username.slice(1).trim();

	if (discord_username && discord_username.length > 0)
		description += '\n\n## 👤 Discord\n' + '`@' + discord_username + '`';

	return { title, description };
}


export function get_new_map_issue_url(data: NewMapRequest): string
{
	const { title, description } = get_new_map_issue(data);

	return `https://github.com/angeluriot/Papermap/issues/new?template=new_map.md&title=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}`;
}
