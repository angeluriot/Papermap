# ðŸ“– How to add or edit maps?

This page explains how to add or edit maps (not individual papers). For details on adding or editing papers within a map, see **[this page](/doc/contribute/papers.md)**.

## ðŸ“¨ Request a map

On the **[main page](https://papermap.org)** there is a `New map` link at the bottom. Clicking it opens a form to request a new map with the following fields:

* `Title`: the title of the map *(required)*

* `Description`: a short description of the map *(optional)*

* `Papers`: a list of papers to include in the map *(optional)*

* `Additional comment`: any additional comment or information *(optional)*

* `Discord username`: for the `Contributor` role on the **[Papermap Discord server](https://discord.gg/eFdjRJe7WZ)** *(optional)*

When the form is filled out, click on the `Submit` button to send your request. You will be redirected to a GitHub issue created by a bot containing your request.

You can also click on the `Submit using your own GitHub account` button to be redirected to a pre-filled GitHub issue that you can submit yourself.

A maintainer will then review your request and may create the corresponding map.

## âœï¸ Add or edit a map

This section is for developers only since currently maps cannot be created or edited directly on the website. Feel free to ask for help in the **[Discord server](https://discord.gg/eFdjRJe7WZ)**.

Map files are located in the **[/data/maps](/data/maps)** folder of the repository, the directory structure inside this folder will be reflected on the **[Papermap maps](https://papermap.org/maps)** page of the website.

Each subfolder must contain an `_init_.json` file providing the group metadata:
```json
{
	"emoji": "ðŸ’‰", // Emoji of the group
	"name": "Vaccines" // Name of the group
}
```

Map files must have a unique name across the entire `/data/maps` tree and follow this JSON structure:
```json
{
	// If true, the map is hidden on the website and only accessible via a direct link
	"draft": false,

	// The emoji of the map
	"emoji": "ðŸ§©",

	// The titles of the map
	"question": {

		// The shortest possible phrasing of the question
		"short": "Do vaccines cause autism?",

		// A more detailed version of the question
		"long": "Do vaccines increase the risk of developing autism or ASD?"
	},

	// A short description of the map
	"description": "Results from studies evaluating the impact of vaccines on the development of autism or ASD (Autism Spectrum Disorder).",

	// Tags related to the map (used for search)
	"tags": [
		"vaccines",
		"autism",
		"children",
		"health",
		"medicine"
	],

	// The possible "Previous consensus" options for the map (see: /doc/contribute/papers.md#previous-consensus)
	"consensus": {

		// A "no_consensus" entry must be present with this exact key (fields can be customized)
		"no_consensus": {
			"emoji": "ðŸ¤·",
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

			// Emoji representing the previous consensus
			"emoji": "ðŸ‘Ž",

			// Short label for the previous consensus
			"text": "No",

			// Short description of the previous consensus
			"description": "The literature suggests that vaccines do not cause autism",

			// Color of the previous consensus (see: /src/lib/colors.ts for available colors)
			"color": "Red",

			// List of disallowed "Paper result" values if this previous consensus is selected (see below)
			"unavailable": [
				"no_unlike_literature", // This one is unavailable because it contradicts this previous consensus
				"yes" // This one is unavailable to force "yes_unlike_literature" to be selected instead
			]
		},

		// Other previous consensus options, in this example it would be "towards_no", "towards_yes" and "yes"
	},

	// "Paper result" groups as displayed in the top summary bar (order matters: first = leftmost)
	"conclusion_groups": {

		// This example is a Yes/No question but it can be anything else
		"no": {

			// Label of the group
			"text": "No",

			// Color of the group (see: /src/lib/colors.ts for available colors)
			"color": "Red"
		},

		// Additional groups (e.g., "no_but", "maybe")

		// A "more_research_needed" entry must be present with this exact key (place it roughly in the middle)
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

			// The conclusion group key it belongs to (must match one in "conclusion_groups")
			"group": "no",

			// Emoji of the paper result
			"emoji": "ðŸ‘Ž",

			// Short label of the paper result
			"text": "No",

			// Short description of the paper result
			"description": "The results of the paper show no significant effect of the vaccines evaluated on the risk of developing autism",

			// True if the result implies a statistically significant effect (determines whether to request a p-value)
			"p_value": false
		},

		// Other paper results, in this example it would be "no_unlike_literature", "no_but_mixed_results", "maybe", "yes_but_low_confidence", "yes_but_small_effect", "yes_unlike_literature" and "yes"
	},

	// Map options that influence available "Study type" choices and scoring (see: /doc/scoring/papers.md#study-type)
	"type": {

		// True if randomization is impossible for this question (disables "Randomized Controlled Trial")
		"no_random": false,

		// True if the question is not about a causal relationship
		"no_causation": false,

		// True if study type is irrelevant (disables the field)
		"any": false
	},

	// True if blinding is impossible (disables "Blinding" field)
	"no_blinding": false,

	// True if participants are not involved (disables "Sample size" field)
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
