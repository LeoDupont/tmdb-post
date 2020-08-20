export module Navigation {

	export const BASE_URL = 'https://www.themoviedb.org';

	// =======================================================
	// == HELPERS
	// =======================================================

	/**
	 * Concatenates GET parameters to the base URL.
	 * @param url Base URL
	 * @param params Array of GET parameters
	 */
	function createUrl(url: string, params: string[]) {
		if (params.length > 0) {
			return url + '?' + params.join('&');
		}
		return url;
	}

	// =======================================================
	// == BASICS
	// =======================================================

	export function getHomeUrl() {
		return BASE_URL;
	}

	export function getLoginUrl() {
		return `${BASE_URL}/login`;
	}

	// =======================================================
	// == TV SHOWS
	// =======================================================

	export enum ShowEditSections {
		PrimaryFacts = 'primary_facts',
		AlternativeNames = 'alternative_titles',
		ContentRatings = 'content_ratings',
		Crew = 'crew',
		EpisodeGroups = 'episode_groups',
		ExternalIds = 'external_ids',
		Genres = 'genres',
		Keywords = 'keywords',
		ProductionInformation = 'production_information',
		RegularCast = 'regular_cast',
		Seasons = 'seasons',
		Videos = 'videos',
	}

	export enum SeasonEditSections {
		PrimaryFacts = 'primary_facts',
		Episodes = 'episodes',
		ExternalIds = 'external_ids',
		Videos = 'videos',
	}

	/**
	 * Get a URL to a TV show page in view or `edit` mode.
	 * @param showId TMDb ID of the show
	 * @param language Set the language of the show translation to work with. Uses the user's default language if undefined.
	 * @param editSection To get to a specific edit section
	 */
	export function getShowUrl(showId: string, language?: string, editSection?: ShowEditSections) {

		const params = [];
		let showUrl = `${BASE_URL}/tv/${showId}`;

		if (editSection) {
			showUrl += '/edit';
			params.push('active_nav_item=' + editSection);
		}

		if (language) {
			params.push('language=' + language);
		}

		return createUrl(showUrl, params);
	}

	/**
	 * Get a URL to a season of a TV show in view or `edit` mode.
	 * @param showId TMDb ID of the show
	 * @param season Season number (`0` for the 'Specials' season)
	 * @param language Set the language of the show translation to work with. Uses the user's default language if undefined.
	 * @param editSection To get to a specific edit section
	 */
	export function getSeasonUrl(showId: string, season: number, language?: string, editSection?: SeasonEditSections) {

		const params = [];
		let seasonUrl = `${BASE_URL}/tv/${showId}/season/${season}`;

		if (editSection) {
			seasonUrl += '/edit';
			params.push('active_nav_item=' + editSection);
		}

		if (language) {
			params.push('language=' + language);
		}

		return createUrl(seasonUrl, params);
	}

}