import puppeteer, { LaunchOptions, ConnectOptions } from 'puppeteer';
import { Browser } from './browser';
import { Errors } from './errors';
import { Episode, Season } from './data/tv-show';
import { Auth } from './tmdb-scraping/auth';
import { ShowSeasons } from './tmdb-scraping/show-seasons';
import { ShowEpisodes } from './tmdb-scraping/show-episodes';

/**
 * Main class of tmdb-post.
 * Acts like a black box for consumers.
 */
export class TmdbPost {

	private browser?: puppeteer.Browser;

	constructor() {}

	// =======================================================
	// == INIT/DESTROY (Browser)
	// =======================================================

	public async init(options?: LaunchOptions | ConnectOptions, webSocketDebugUrl?: string) {
		if (webSocketDebugUrl) {
			this.browser = await Browser.attachToBrowser(webSocketDebugUrl, options);
		} else {
			this.browser = await Browser.launchBrowser(options);
		}
		this.checkBrowser();
	}

	/**
	 * Disconnects from attached browser or closes opened browser.
	 */
	public async destroy() {
		if (this.browser?.wsEndpoint()) {
			return this.browser.disconnect();
		}
		return this.browser?.close();
	}

	private checkBrowser() {
		if (!this.browser) {
			throw new Errors.BrowserNotLaunched();
		}
		if (!this.browser.isConnected()) {
			throw new Errors.BrowserNotConnected();
		}
	}

	// =======================================================
	// == AUTH
	// =======================================================

	public async logIn(credentials: Auth.Credentials) {
		this.checkBrowser();
		return Auth.authenticate(this.browser!, credentials);
	}

	public async isLoggedIn() {
		this.checkBrowser();
		return Auth.checkIfLoggedIn(this.browser!);
	}

	// =======================================================
	// == TV SHOWS
	// =======================================================

	// -------------------------------------------------------
	// -- SHOWS
	// -------------------------------------------------------

	// -------------------------------------------------------
	// -- SEASONS
	// -------------------------------------------------------

	/**
	 * Posts a new season in a TV show if it doesn't already exist.
	 * @param showId TMDb ID of the show
	 * @param season Season to post. `name` default to `'Season N'` (without zero-padding) and `overview` defaults to an empty string.
	 * @param allowUpdate (**unimplemented**) Updates season data if it already exists
	 * @returns `true` if the season has been added or already exists
	 */
	public async postSeason(showId: string, season: Season, allowUpdate?: boolean) {
		this.checkBrowser();
		return ShowSeasons.postSeason(this.browser!, showId, season, allowUpdate);
	}

	// -------------------------------------------------------
	// -- EPISODES
	// -------------------------------------------------------

	/**
	 * Post episodes in a TV show's season if they don't already exist.
	 * @param showId TMDb ID of the show
	 * @param season Season number
	 * @param episodes Episodes to post
	 * @param allowUpdate (**unimplemented**) Updates episodes data if they already exist
	 */
	public async postEpisodesInSeason(showId: string, season: number, episodes: Episode[], allowUpdate?: boolean) {
		this.checkBrowser();
		return ShowEpisodes.postEpisodesInSeason(this.browser!, showId, season, episodes, allowUpdate);
	}

}