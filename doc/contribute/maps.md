# 📄 How to add or edit maps?

This page describes how to add or edit maps, not papers. For information on how to add or edit papers in a map, please see [this page](/doc/contribute/papers.md).

## 📨 Request a map

On the **[main page](https://papermap.org)** of the website, there is a `New map` text at the bottom, clicking on it will open a form to request a new map with the following fields:

* **Title**: the title of the map *(required)*

* **Description**: a short description of the map *(optional)*

* **Papers**: a list of papers to include in the map *(optional)*

* **Additional comment**: any additional comment or information *(optional)*

* **Discord username**: for the `Contributor` role on the **[Papermap discord](https://discord.gg/eFdjRJe7WZ)** *(optional)*

When the form is filled, click on the `Submit` button to send your request, it will redirect you to a GitHub issue created by a bot with your request.

You can also click on the `Submit using your own GitHub account` to get redirected to a pre-filled GitHub issue that you can submit yourself.

A maintainer will then review your request and may create the corresponding map.

## ✏️ Create / edit a map

This part is for developers only since there is currently no way to create or edit maps directly on the website.

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
	"draft": false, // If true, the map will not be visible on the website and can only be accessed using a direct link
	"emoji": "🧩", // The emoji of the map
	"question": {
		"short": "Do vaccines cause autism?", // The shortest possible version of the question
		"long": "Do vaccines increase the risk of developing autism or ASD?" // A more detailed version of the question
	},
	"description": "Results from studies evaluating the impact of vaccines on the development of autism or ASD (Autism Spectrum Disorder).", // A short description of the map
	"tags": [ // A list of tags related to the map (used for searching)
		"vaccines",
		"autism",
		"children",
		"health",
		"medicine"
	],
	"consensus": { // The possible "previous consensus" options for the map (see: /doc/contribute/papers.md#previous-consensus)
		"no_consensus": { // A "no_consensus" one has to be there with this exact key but you can customize all its fields
			"emoji": "🤷",
			"text": "No consensus yet",
			"description": "The literature has not yet reached a consensus on the effects of vaccines on autism",
			"color": "Gray",
			"unavailable": [
				"no_unlike_literature",
				"yes_unlike_literature"
			]
		},
		"no": { // Here it's a Yes/No question but it can be anything else
			"emoji": "👎", // The emoji of the previous consensus
			"text": "No", // The text of the previous consensus
			"description": "The literature suggests that vaccines do not cause autism", // A short description of the previous consensus
			"color": "Red", // The color of the previous consensus (see: /src/lib/
			"unavailable": [
				"no_unlike_literature",
				"yes"
			]
		},
		"towards_no": {
			"emoji": "⬅️",
			"text": "Towards no",
			"description": "The literature suggests that vaccines probably don't cause autism, but more research is needed",
			"color": "Red1H",
			"unavailable": [
				"no_unlike_literature",
				"yes_unlike_literature"
			]
		},
		"towards_yes": {
			"emoji": "➡️",
			"text": "Towards yes",
			"description": "The literature suggests that vaccines may cause autism, but more research is needed",
			"color": "Green1H",
			"unavailable": [
				"no_unlike_literature",
				"yes_unlike_literature"
			]
		},
		"yes": {
			"emoji": "👍",
			"text": "Yes",
			"description": "The literature suggests that vaccines cause autism",
			"color": "Green",
			"unavailable": [
				"no",
				"yes_unlike_literature"
			]
		}
	},
	"conclusion_groups": {
		"no": {
			"text": "No",
			"color": "Red"
		},
		"no_but": {
			"text": "No but...",
			"color": "Red1H"
		},
		"maybe": {
			"text": "Maybe",
			"color": "Yellow"
		},
		"more_research_needed": {
			"text": "More research needed",
			"color": "Gray"
		},
		"yes_but": {
			"text": "Yes but...",
			"color": "Green1H"
		},
		"yes": {
			"text": "Yes",
			"color": "Green"
		}
	},
	"conclusions": {
		"no": {
			"group": "no",
			"emoji": "👎",
			"text": "No",
			"description": "The results of the paper show no significant effect of the vaccines evaluated on the risk of developing autism",
			"p_value": false
		},
		"no_unlike_literature": {
			"group": "no_but",
			"emoji": "↩️",
			"text": "No unlike literature",
			"description": "The results of the paper show no significant effect of the vaccines evaluated on the risk of developing autism, unlike what is reported in the literature",
			"p_value": false
		},
		"no_but_mixed_results": {
			"group": "no_but",
			"emoji": "🔀",
			"text": "No but mixed results",
			"description": "The results of the paper show no significant overall effect of the vaccines evaluated on the risk of developing autism, but there are mixed results on specific cases",
			"p_value": false
		},
		"maybe": {
			"group": "maybe",
			"emoji": "🤷",
			"text": "Maybe",
			"description": "The results of the paper suggest that the vaccines evaluated might have an effect on the risk of developing autism, but the evidence is not strong enough to conclude",
			"p_value": false
		},
		"yes_but_low_confidence": {
			"group": "yes_but",
			"emoji": "🤔",
			"text": "Yes but low confidence",
			"description": "The results of the paper suggest that the vaccines evaluated may increase the risk of developing autism, but the evidence is not strong",
			"p_value": true
		},
		"yes_but_small_effect": {
			"group": "yes_but",
			"emoji": "🤏",
			"text": "Yes but small effect",
			"description": "The results of the paper suggest that the vaccines evaluated may have a small effect on the risk of developing autism",
			"p_value": true
		},
		"yes_unlike_literature": {
			"group": "yes_but",
			"emoji": "↪️",
			"text": "Yes unlike literature",
			"description": "The results of the paper suggest that the vaccines evaluated may increase the risk of developing autism, unlike what is reported in the literature",
			"p_value": true
		},
		"yes": {
			"group": "yes",
			"emoji": "👍",
			"text": "Yes",
			"description": "The results of the paper suggest that the vaccines evaluated increase the risk of developing autism",
			"p_value": true
		}
	},
	"type": {
		"no_random": false,
		"no_causality": false,
		"any": false
	},
	"no_blinding": false,
	"no_sample_size": false,
	"papers": [
		// Papers (can start empty since it's much easier to add them using the website)
	]
}
```
