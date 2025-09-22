import { OpenAlexAPIError } from '$lib/errors';
import { clean_doi } from '$lib/server/utils';
import { constants as C } from '$lib/server/utils';
import { clean_id } from '$lib/utils';


export interface OpenAlexPaper
{
	id: string;
	doi: string;
	title: string;
	display_name: string;
	relevance_score: number;
	publication_year: number;
	publication_date: string;
	ids: {
		openalex: string,
		doi: string,
		mag: string,
		pmid: string,
	};
	language: string;
	primary_location: {
		is_oa: boolean,
		landing_page_url: string,
		pdf_url: string | null,
		source: {
			id: string,
			display_name: string,
			issn_l: string,
			issn: string[],
			is_oa: boolean,
			is_in_doaj: boolean,
			is_indexed_in_scopus: boolean,
			is_core: boolean,
			host_organization: string,
			host_organization_name: string,
			host_organization_lineage: string[],
			host_organization_lineage_names: string[],
			type: string,
		},
		license: string | null,
		license_id: string | null,
		version: string | null,
		is_accepted: boolean,
		is_published: boolean,
	};
	type: string;
	type_crossref: string;
	indexed_in: string[];
	open_access: {
		is_oa: boolean,
		oa_status: string,
		oa_url: string | null,
		any_repository_has_fulltext: boolean,
	};
	authorships: {
		author_position: string,
		author: {
			id: string,
			display_name: string,
			orcid: string,
		},
		institutions: {
			id: string,
			display_name: string,
			ror: string,
			country_code: string,
			type: string,
			lineage: string[],
		}[],
		countries: string[],
		is_corresponding: boolean,
		raw_author_name: string,
		raw_affiliation_strings: string[],
		affiliations: {
			raw_affiliation_string: string,
			institution_ids: string[],
		}[],
	}[];
	institution_assertions: any[];
	countries_distinct_count: number;
	institutions_distinct_count: number;
	corresponding_author_ids: string[];
	corresponding_institution_ids: string[];
	apc_list: {
		value: number,
		currency: string,
		value_usd: number,
	};
	apc_paid: boolean | null;
	fwci: number;
	has_fulltext: boolean;
	fulltext_origin: string;
	cited_by_count: number;
	citation_normalized_percentile: {
		value: number,
		is_in_top_1_percent: boolean,
		is_in_top_10_percent: boolean,
	};
	cited_by_percentile_year: {
		min: number,
		max: number,
	};
	biblio: {
		volume: string,
		issue: string,
		first_page: string,
		last_page: string,
	};
	is_retracted: boolean;
	is_paratext: boolean;
	primary_topic: {
		id: string,
		display_name: string,
		score: number,
		subfield: {
			id: string,
			display_name: string,
		},
		field: {
			id: string,
			display_name: string,
		},
		domain: {
			id: string,
			display_name: string,
		},
	};
	topics: {
		id: string,
		display_name: string,
		score: number,
		subfield: {
			id: string,
			display_name: string,
		},
		field: {
			id: string,
			display_name: string,
		},
		domain: {
			id: string,
			display_name: string,
		},
	}[];
	keywords: {
		id: string,
		display_name: string,
		score: number,
	}[];
	concepts: {
		id: string,
		wikidata: string,
		display_name: string,
		level: number,
		score: number,
	}[];
	mesh: {
		descriptor_ui: string,
		descriptor_name: string,
		qualifier_ui: string,
		qualifier_name: string | null,
		is_major_topic: boolean,
	}[];
	locations_count: number;
	locations: {
		is_oa: boolean,
		landing_page_url: string,
		pdf_url: string | null,
		source: {
			id: string,
			display_name: string,
			issn_l: string,
			issn: string[],
			is_oa: boolean,
			is_in_doaj: boolean,
			is_indexed_in_scopus: boolean,
			is_core: boolean,
			host_organization: string,
			host_organization_name: string,
			host_organization_lineage: string[],
			host_organization_lineage_names: string[],
			type: string,
		},
		license: string | null,
		license_id: string | null,
		version: string | null,
		is_accepted: boolean,
		is_published: boolean,
	}[];
	best_oa_location: string | null;
	sustainable_development_goals: {
		score: number,
		display_name: string,
		id: string,
	}[];
	grants: any[];
	datasets: any[];
	versions: any[];
	referenced_works_count: number;
	referenced_works: string[];
	related_works: string[];
	abstract_inverted_index: string | null;
	abstract_inverted_index_v3: string | null;
	cited_by_api_url: string;
	counts_by_year: {
		year: number,
		cited_by_count: number,
	}[];
	updated_date: string;
	created_date: string;
}


export async function openalex_search(doi?: string, title?: string, year?: number): Promise<OpenAlexPaper[]>
{
	try
	{
		let doi_results: OpenAlexPaper[] = [];
		let title_results: OpenAlexPaper[] = [];

		if (doi)
		{
			const id = clean_id(doi);

			const query = new URLSearchParams({
				'filter': /^W\d+$/.test(id) ? 'openalex:' + id : 'doi:' + clean_doi(doi),
				'mailto': C.OPENALEX_EMAIL ?? '',
				'per-page': '2',
				'page': '1',
			});

			const response = await fetch('https://api.openalex.org/works?' + query.toString());

			if (response.ok)
			{
				doi_results = (await response.json()).results;

				if (doi_results.length == 1)
					return doi_results;
			}

			else if (!title || !year)
				throw new OpenAlexAPIError(`Request failed: ${response.status} ${response.statusText}`);
		}

		if (title && year)
		{
			const query = new URLSearchParams({
				'filter': `title.search:"${title.replaceAll(',', '')}",publication_year:${year.toString()}`,
				'mailto': C.OPENALEX_EMAIL ?? '',
				'per-page': '2',
				'page': '1',
			});

			const response = await fetch('https://api.openalex.org/works?' + query.toString());

			if (response.ok)
			{
				title_results = (await response.json()).results;

				if (title_results.length == 1 || doi_results.length == 0)
					return title_results;

				if (doi_results.length > 0)
					return doi_results;

				return title_results;
			}

			else if (doi_results.length == 0)
				throw new OpenAlexAPIError(`Request failed: ${response.status} ${response.statusText}`);
		}

		return doi_results;
	}

	catch (error: any)
	{
		if (error instanceof OpenAlexAPIError)
			throw error;

		throw new OpenAlexAPIError(`Error fetching data: "${error?.message}"`);
	}
}
