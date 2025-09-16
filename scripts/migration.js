import fs from 'fs';
import { join } from 'path';


const MAPS_ROOT = join(process.cwd(), 'data', 'maps');


async function get_maps(dir)
{
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries)
	{
		const full_path = join(dir, entry.name);

		if (entry.isDirectory())
			files.push(...await get_maps(full_path));

		else if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== '_init_.json')
			files.push(full_path);
	}

	return files;
}


async function apply_migration(file_path)
{
	const content = await fs.promises.readFile(file_path, 'utf-8');
	const map = JSON.parse(content);

	for (const paper of map.papers)
	{
		// Code
	}

	// Edit
	//const new_content = JSON.stringify(map, null, '\t') + '\n';
	//await fs.promises.writeFile(file_path, new_content, 'utf-8');
	console.log(`Migrated: "${map.question.short}"`);
}


async function main()
{
	const map_files = await get_maps(MAPS_ROOT);

	for (const file_path of map_files)
		await apply_migration(file_path);

	console.log(`\nMigration applied to ${map_files.length} files`);
	process.exit(0);
}


main().catch(err =>
{
	console.error(err);
	process.exit(1);
});
