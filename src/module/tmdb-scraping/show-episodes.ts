import puppeteer from 'puppeteer';
import { Browser } from '../browser';
import { Navigation } from './navigation';
import { Errors } from '../errors';
import { Season, Episode } from '../data/tv-show';

export module ShowEpisodes {

	const SELECTORS = {
		ADD_BTN: '#grid > div.k-header.k-grid-toolbar > a',
		NUMBER_INPUT: '#episode_number_numeric_text_box_field',
		NAME_INPUT: '#en-US_name_text_input_field',
		OVERVIEW_INPUT: '#en-US_overview_text_box_field',
		AIR_DATE_INPUT: '#air_date_date_picker_field',
		SAVE_BTN: '.k-edit-buttons.k-state-default > a.k-button.k-button-icontext.k-primary.k-grid-update',
	};

	// =======================================================
	// == POSTING EPISODES
	// =======================================================

	/**
	 * Post episodes in a TV show's season.
	 * @param browser
	 * @param showId TMDb ID of the show
	 * @param season Season number
	 * @param episodes Episodes to post
	 * @param allowUpdate (**unimplemented**) Updates episodes data if they already exist
	 */
	export async function postEpisodesInSeason(browser: puppeteer.Browser, showId: string, season: number, episodes: Episode[], allowUpdate?: boolean) {

		// === Get a page on the show's season's episodes edit page ===

		const seasonUrl = Navigation.getSeasonUrl(showId, season, true,
			Navigation.SeasonEditSections.Episodes
		);
		const page = await Browser.getAPage(browser, seasonUrl, true);
		if (page.url() !== seasonUrl) {
			throw new Errors.NotFound(seasonUrl);
		}

		// === Add/update episodes ===

		episodes.forEach(async (episode) => {

			// TODO:
			// check if episode number exists
			const exists = false;

			if (!exists) {

				await addNewEpisode(page, episode);

			} else if (allowUpdate) {

				// TODO:
				// updateEpisode(page, episode);

			}
		});

	}

	// =======================================================
	// == FORM FILLING (Add/Update)
	// =======================================================

	async function addNewEpisode(page: puppeteer.Page, episode: Episode) {

		// === Open the "Edit" modal windows ===

		const addBtn = await page.$(SELECTORS.ADD_BTN);
		if (!addBtn) {
			throw new Errors.NotFound('"Add New Episode" button on ' + page.url());
		}

		await addBtn?.click();
		const input = await page.waitForSelector(SELECTORS.NUMBER_INPUT);
		if (!input) {
			throw new Errors.NotFound('"Episode Number" input on ' + page.url());
		}

		// === Input episode data ===
		// (Number input is last because of autotabbing from Number to Name inputs)

		await page.type(SELECTORS.NAME_INPUT, episode.name);
		await page.type(SELECTORS.OVERVIEW_INPUT, episode.overview);
		await page.type(SELECTORS.AIR_DATE_INPUT, episode.date);
		await page.type(SELECTORS.NUMBER_INPUT, episode.number.toString());

		// === Submit form ===

		await page.click(SELECTORS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.NUMBER_INPUT, { hidden: true });
	}

	// TODO:
	// updateEpisode

	// =======================================================
	// == EPISODES CHECKING
	// =======================================================

	// TODO
}