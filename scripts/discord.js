import 'dotenv/config';
import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';


const token = process.env.DISCORD_TOKEN ?? '';
const [, , type, url, title, body, author, labels_string] = process.argv;
const label_list = labels_string ? labels_string.split(',').filter(
	l => l.trim() !== 'duplicate' && !(type === 'pull request' && l.trim() === 'question') && l.trim().length > 0,
) : [];
const server_id = '1362190024371736726';
const content_channels = {
	new_maps: '1362753544913944667',
	map_updates: '1362754510417694821',
	other: '1362763424148492368',
};
const code_channels = {
	scoring: '1362759280549302335',
	features: '1362761670002475160',
	bugs: '1362761739363418272',
	other: '1362762425379590307',
};
const labels = {
	bug: 'bug',
	duplicate: 'duplicate',
	map_update: 'map update',
	new_feature: 'new feature',
	new_map: 'new map',
	question: 'question',
	scoring_update: 'scoring update',
};
const emojis = {
	issue: '<:issue:1383156488733851829>',
	pull_request: '<:pr:1383156417560576112>',
};


async function get_client()
{
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
	client.once(Events.ClientReady, () => {});
	await client.login(token);

	return client;
}


async function send_message(client, channel_id, message)
{
	const channel = await client.channels.fetch(channel_id);

	if (!channel || !(channel instanceof TextChannel))
		throw new Error('Channel not found or not a text channel');

	await channel.send(message);
}


function get_discord_username(body)
{
	let match = body.match(/## ðŸ‘¤ Discord\n`([^`]+)`/);
	return match ? match[1].trim().slice(1).trim() : null;
}


async function get_user_id(client, username)
{
	const guild = await client.guilds.fetch(server_id);
	await guild.members.fetch();
	const member = guild.members.cache.find(m => m.user.username.toLowerCase() === username.toLowerCase());

	if (!member)
		return null;

	return member.id;
}


async function main()
{
	const client = await get_client();

	let usernames = [];
	let user_ids = [];
	const discord_username = get_discord_username(body);

	if (discord_username)
		usernames.push(discord_username);

	if (!author.includes('papermap-bot'))
		usernames.push(author);

	for (const username of usernames)
	{
		const id = await get_user_id(client, username);

		if (id)
			user_ids.push(id);
	}

	let final_author = '';

	if (user_ids.length > 0)
		final_author = `<@${user_ids[0]}>`;
	else if (usernames.length > 0)
		final_author = `**${usernames[0]}**`;

	const from = final_author !== '' ? ' from ' : '';
	const found_by = final_author !== '' ? ' found by ' : ' found';
	const emoji = type === 'issue' ? emojis.issue : emojis.pull_request;

	if (label_list.length != 1)
	{
		await send_message(client, code_channels.other, `${emoji} New **${type}**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	const label = label_list[0];

	if (label === labels.bug)
	{
		if (type === 'issue')
			await send_message(client, code_channels.bugs, `${emoji} New **ðŸ› Bug**${found_by}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(client, code_channels.bugs, `${emoji} New **ðŸ› Bug Fix**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.map_update)
	{
		if (type === 'issue')
			await send_message(client, content_channels.map_updates, `${emoji} New **ðŸ“© Map Update Request**${from}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(client, content_channels.map_updates, `${emoji} New **âœï¸ Map Update**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.new_feature)
	{
		if (type === 'issue')
			await send_message(client, code_channels.features, `${emoji} New **ðŸª„ Feature Request**${from}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(client, code_channels.features, `${emoji} New **âœ¨ Feature**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.new_map)
	{
		if (type === 'issue')
			await send_message(client, content_channels.new_maps, `${emoji} New **ðŸ“¨ Map Request**${from}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(client, content_channels.new_maps, `${emoji} New **ðŸ—ºï¸ Map**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.question)
	{
		await send_message(client, content_channels.other, `${emoji} New **â“ Question**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	if (label === labels.scoring_update)
	{
		if (type === 'issue')
			await send_message(client, code_channels.scoring, `${emoji} New **ðŸ¥‡ Scoring Update Request**${from}${final_author}!\n*${title}*\n${url}`);
		else
			await send_message(client, code_channels.scoring, `${emoji} New **ðŸ… Scoring Update**${from}${final_author}!\n*${title}*\n${url}`);
		process.exit(0);
	}

	await send_message(client, code_channels.other, `${emoji} New **${type}**${from}${final_author}!\n*${title}*\n${url}`);
	process.exit(0);
}


await main();
