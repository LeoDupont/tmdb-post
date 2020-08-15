export module TmdbWebsite {

	export const BASE_URL = 'https://www.themoviedb.org';

	// =======================================================
	// == URLs
	// =======================================================

	export function getHomeUrl() {
		return BASE_URL;
	}

	export function getLoginUrl() {
		return `${BASE_URL}/login`;
	}

}