# 📖 How to add or edit maps?

This page describes how to add or edit maps, not papers. For information on how to add or edit papers in a map, please see [this page](/doc/contribute/papers.md).

# 📨 Request a map

On the **[main page](https://papermap.org)** of the website, there is a `New map` text at the bottom, clicking on it will open a form to request a new map with the following fields:

* `Title`: the title of the map *(required)*

* `Description`: a short description of the map *(optional)*

* `Papers`: a list of papers to include in the map *(optional)*

* `Additional comment`: any additional comment or information *(optional)*

* `Discord username`: for the `Contributor` role on the **[Papermap discord](https://discord.gg/eFdjRJe7WZ)** *(optional)*

When the form is filled, click on the `Submit` button to send your request, it will redirect you to a GitHub issue created by a bot with your request.

You can also click on the `Submit using your own GitHub account` to get redirected to a pre-filled GitHub issue that you can submit yourself.

A maintainer will then review your request and may create the corresponding map.

# ✏️ Add or edit a map

This part is for developers only since there is currently no way to create or edit maps directly on the website. Feel free to join the **[Discord server](https://discord.gg/eFdjRJe7WZ)** if you need help.

The map files are located in the **[/data/maps](/data/maps)** folder of the repository, the directory structure inside this folder will be reflected on the **[Papermap maps](https://papermap.org/maps)** page of the website.

Each sub-folder must have an `_init_.json` file containing the metadata of the group:
```json
{
	"emoji": "💉", // Emoji of the group
	"name": "Vaccines" // Name of the group
}
```

Maps files must have a unique name across the whole `/data/maps` folder and must be in JSON format with the following structure:
```json
{
	// If true, the map will not be visible on the website and can only be accessed using a direct link
	"draft": false,

	// The emoji of the map
	"emoji": "🧩",

	// The titles of the map
	"question": {

		// The shortest possible version of the question
		"short": "Do vaccines cause autism?",

		// A more detailed version of the question
		"long": "Do vaccines increase the risk of developing autism or ASD?"
	},

	// A short description of the map
	"description": "Results from studies evaluating the impact of vaccines on the development of autism or ASD (Autism Spectrum Disorder).",

	// A list of tags related to the map (used for searching)
	"tags": [
		"vaccines",
		"autism",
		"children",
		"health",
		"medicine"
	],

	// The possible "Previous consensus" options for the map (see: /doc/contribute/papers.md#previous-consensus)
	"consensus": {

		// A "no_consensus" one has to be there with this exact key but you can customize all its fields
		"no_consensus": {
			"emoji": "🤷",
			"text": "No consensus yet",
			"description": "The literature has not yet reached a consensus on the effects of vaccines on autism",
			"color": "Gray",
			"unavailable": [
				"no_unlike_literature",
				"yes_unlike_literature"
			]
		},

		// This example is a Yes/No question but it can be anything else
		"no": {

			// The emoji of the previous consensus
			"emoji": "👎",

			// The text of the previous consensus
			"text": "No",

			// A short description of the previous consensus
			"description": "The literature suggests that vaccines do not cause autism",

			// The color of the previous consensus (see: /src/lib/clolors.ts for available colors)
			"color": "Red",

			// A list of unavailable "Paper result" if this previous consensus is selected (see below)
			"unavailable": [
				"no_unlike_literature", // Here this one is unavailable because it contradicts this previous consensus
				"yes" // Here this one is unavailable to force "yes_unlike_literature" to be selected instead
			]
		},

		// Other previous consensus options, in this example it would be "towards_no", "towards_yes" and "yes"
	},

	// The groups of "Paper result" as shown in the top summary bar on map pages, the order is important here: the first group will be the leftmost one on the bar
	"conclusion_groups": {

		// This example is a Yes/No question but it can be anything else
		"no": {

			// The text of the group
			"text": "No",

			// The color of the group (see: /src/lib/clolors.ts for available colors)
			"color": "Red"
		},

		// Other groups, in this example it would be "no_but" and "maybe"

		// A "more_research_needed" one has to be there with this exact key but you can customize its fields, place it in the middle
		"more_research_needed": {
			"text": "More research needed",
			"color": "Gray"
		},

		// Other groups, in this example it would be "yes_but" and "yes"
	},

	// The possible "Paper result" options for the map (see: /doc/contribute/papers.md#paper-result)
	"conclusions": {

		// This example is a Yes/No question but it can be anything else
		"no": {

			// The conclusion group it belongs to (must be one of the keys of "conclusion_groups" above)
			"group": "no",

			// The emoji of the paper result
			"emoji": "👎",

			// The text of the paper result
			"text": "No",

			// A short description of the paper result
			"description": "The results of the paper show no significant effect of the vaccines evaluated on the risk of developing autism",

			// True if the paper result implies a statistically significant effect and false otherwise (used to ask or not for a p-value when adding papers)
			"p_value": false
		},

		// Other paper results, in this example it would be "no_unlike_literature", "no_but_mixed_results", "maybe", "yes_but_low_confidence", "yes_but_small_effect", "yes_unlike_literature" and "yes"
	},

	// Map options that affect the available "Study type" options and affect scoring (see: /doc/scoring/papers.md#study-type)
	"type": {

		// True if an experiment answering the question on this map cannot be randomized (disables "Randomized Controlled Trial" option)
		"no_random": false,

		// True if the question of this map isn't about a causal relationship
		"no_causality": false,

		// True if the "Study type" is irrelevant for this map (disables "Study type" field)
		"any": false
	},

	// True if an experiment answering the question on this map cannot be blinded (disables "Blinding" field)
	"no_blinding": false,

	// True if an experiment answering the question cannot involve participants (disables "Sample size" field)
	"no_sample_size": false,

	// Papers (can start empty since it's much easier to add them using the website)
	"papers": [
		// Papers go here (see: /doc/contribute/papers.md)
	]
}
```

A map `<file-name>.json` in any sub-folder of `/data/maps` can be accessed on the website at `http://localhost:5173/maps/<file-name>` when **[running locally](/README.md#%EF%B8%8F-install)**.

You can then add all the relevant papers to the map using the website interface (see: the **[papers documentation](/doc/contribute/papers.md)**) and make a pull request with your changes. You can also set the `draft` field to `true` to let anyone add papers to the map before making it public.

If you encounter any issues, feel free to ask in the **[Discord server](https://discord.gg/eFdjRJe7WZ)**.
