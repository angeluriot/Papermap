import { Client, GatewayIntentBits, Events, TextChannel } from 'discord.js';
import 'dotenv/config';


const token = process.env.VITE_DISCORD_TOKEN ?? '';
const [, , type, url, title, body, author, labels_string] = process.argv;
const label_list = labels_string ? labels_string.split(',').filter(l => l.trim().length > 0) : [];
const content_channels = {
	new_maps: '1362753544913944667',
	update_maps: '1362754510417694821',
	new_papers: '1362825668328558654',
	update_papers: '1362827857595732169',
	other: '1362763424148492368',
};
const code_channels = {
	feature: '1362761670002475160',
	bug: '1362761739363418272',
	other: '1362762425379590307',
};
const labels = {
	bug: 'bug',
	duplicate: 'duplicate',
	enhancement: 'enhancement',
	map_update: 'map update',
	new_map: 'new map',
	papers_update: 'papers update',
	question: 'question',
};
const emojis = {
	issue: '<:issue:1383156488733851829>',
	pull_request: '<:pr:1383156417560576112>',

};


async function send_message(channel_id, message)
{
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
	client.once(Events.ClientReady, () => {});
	await client.login(token);
	const channel = await client.channels.fetch(channel_id);

	if (!channel || !(channel instanceof TextChannel))
		throw new Error('Channel not found or not a text channel');

	await channel.send(message);
}


function get_discord_username(body)
{
	const match = body.match(/## 👤 Discord\n`([^`]+)`/);
	return match ? match[1].trim() : null;
}


async function main()
{
	const github_username = author !== 'papermap-bot' ? author : null;
	const discord_username = get_discord_username(body);
	let final_author = '';

	if (discord_username)
		final_author = `@${discord_username}`;
	else if (github_username)
		final_author = `**${github_username}**`;

	const from = final_author !== '' ? ' from ' : '';
	const found_by = final_author !== '' ? ' found by ' : ' found';
	const requested_by = final_author !== '' ? ' requested by ' : ' requested';
	const emoji = type === 'issue' ? emojis.issue : emojis.pull_request;

	if (label_list.length != 1)
	{
		await send_message(code_channels.other, `${emoji} New **${type}**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	const label = label_list[0];

	if (label === labels.bug)
	{
		if (type === 'issue')
			await send_message(code_channels.bug, `${emoji} New **🐛 bug**${found_by}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(code_channels.bug, `${emoji} New **🐛 bug fix**${requested_by}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.enhancement)
	{
		await send_message(code_channels.feature, `${emoji} New **✨ feature**${requested_by}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.map_update)
	{
		await send_message(content_channels.update_maps, `${emoji} New **✏️ map update**${requested_by}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.new_map)
	{
		await send_message(content_channels.new_maps, `${emoji} New **🗺️ map**${requested_by}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.papers_update)
	{
		await send_message(content_channels.update_papers, `${emoji} New **📝 papers update**${requested_by}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.question)
	{
		await send_message(content_channels.other, `${emoji} New **❓ question**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	await send_message(content_channels.other, `${emoji} New **${type}**${from}${final_author}!\n*${title}*\n${url}`);
	process.exit(0);
}


await main();
