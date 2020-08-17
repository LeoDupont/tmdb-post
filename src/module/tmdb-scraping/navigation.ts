export module Navigation {

	export const BASE_URL = 'https://www.themoviedb.org';

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
	 * @param edit `true` to get a URL to the edit page of this show
	 * @param section To get to a specific edit section
	 */
	export function getShowUrl(showId: string, edit?: boolean, section?: ShowEditSections) {
		let showUrl = `${BASE_URL}/tv/${showId}`;

		if (edit) {
			showUrl += '/edit';
			if (section) {
				showUrl += '?active_nav_item=' + section;
			}
		}

		return showUrl;
	}

	/**
	 * Get a URL to a season of a TV show in view or `edit` mode.
	 * @param showId TMDb ID of the show
	 * @param season Season number (`0` for the 'Specials' season)
	 * @param edit `true` to get a URL to the edit page of the season
	 * @param section To get to a specific edit section
	 */
	export function getSeasonUrl(showId: string, season: number, edit?: boolean, section?: SeasonEditSections) {
		let seasonUrl = `${BASE_URL}/tv/${showId}/season/${season}`;

		if (edit) {
			seasonUrl += '/edit';

			if (section) {
				seasonUrl += '?active_nav_item=' + section;
			}
		}

		return seasonUrl;
	}

}