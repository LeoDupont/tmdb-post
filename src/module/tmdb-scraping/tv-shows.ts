import puppeteer from 'puppeteer';
import { Browser } from '../browser';
import { Navigation } from './navigation';
import { Auth } from './auth';
import { Errors } from '../errors';
import { Season, Episode } from '../data/tv-show';

export module TvShows {

	const SELECTORS = {
		SEASONS: {
			ADD_BTN: '#grid > div.k-header.k-grid-toolbar > a',
			NUMBER_INPUT: '#season_number_numeric_text_box_field',
			NAME_INPUT: '#en-US_name_text_input_field',
			OVERVIEW_INPUT: '#en-US_overview_text_box_field',
			SAVE_BTN: '.k-edit-buttons.k-state-default > a.k-button.k-button-icontext.k-primary.k-grid-update'
		},
		EPISODES: {
			ADD_BTN: '#grid > div.k-header.k-grid-toolbar > a',
			NUMBER_INPUT: '#episode_number_numeric_text_box_field',
			NAME_INPUT: '#en-US_name_text_input_field',
			OVERVIEW_INPUT: '#en-US_overview_text_box_field',
			AIR_DATE_INPUT: '#air_date_date_picker_field',
			SAVE_BTN: '.k-edit-buttons.k-state-default > a.k-button.k-button-icontext.k-primary.k-grid-update',
		},
	};

	// =======================================================
	// == SEASONS
	// =======================================================

	/**
	 * Posts a new season in a TV show if it doesn't already exist.
	 * @param browser
	 * @param showId TMDb ID of the show
	 * @param season Season to post. `name` default to `'Season N'` (without zero-padding) and `overview` defaults to an empty string.
	 * @param allowUpdate (**unimplemented**) Updates season data if it already exists
	 * @returns `true` if the season has been added or already existed.
	 */
	export async function postSeason(browser: puppeteer.Browser, showId: string, season: Season, allowUpdate?: boolean) {

		console.log('posting season', JSON.stringify(season));

		// === Get a page on the show's seasons edit page ===

		const showUrl = Navigation.getShowUrl(showId, true, Navigation.ShowEditSections.Seasons);
		const page = await Browser.getAPage(browser, showUrl, true);
		if (page.url() !== showUrl) {
			throw new Errors.NotFound(showUrl);
		}

		// === Check if the season is missing ===

		const exists = await checkSeason(page, season, false);
		console.log('season exists:', exists);
		if (exists) {

			// TODO:
			// allow updates

			return true;
		}

		// === Add New Season ===
		console.log('adding season...');
		return addNewSeason(page, season);
	}

	/**
	 * Adds a new season on a TV show's seasons edit page.
	 * @param page Page open on the show's seasons edit page
	 * @param season Season to post. `name` default to `'Season N'` (without zero-padding) and `overview` defaults to an empty string.
	 * @param allowUpdate (**unimplemented**) Updates season data if it already exists
	 * @returns `true` if the season has been added or already existed
	 */
	async function addNewSeason(page: puppeteer.Page, season: Season, allowUpdate?: boolean) {

		// === Open the "Edit" modal windows ===

		const addBtn = await page.$(SELECTORS.SEASONS.ADD_BTN);
		if (!addBtn) {
			throw new Errors.NotFound('"Add New Season" button on ' + page.url());
		}

		await addBtn?.click();
		const input = await page.waitForSelector(SELECTORS.SEASONS.NUMBER_INPUT);
		if (!input) {
			throw new Errors.NotFound('"Season Number" input on ' + page.url());
		}

		// === Input season data ===
		// (Number input is last because of autotabbing from Number to Name inputs)

		await page.type(SELECTORS.SEASONS.NAME_INPUT, season.name || `Season ${season.number}`);
		await page.type(SELECTORS.SEASONS.OVERVIEW_INPUT, season.overview || '');
		await page.type(SELECTORS.SEASONS.NUMBER_INPUT, season.number.toString());

		// === Submit form ===

		await page.click(SELECTORS.SEASONS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.SEASONS.NUMBER_INPUT, { hidden: true });

		// === Check that the season has been added/updated ===

		return checkSeason(page, season, allowUpdate);
	}

	async function checkSeason(page: puppeteer.Page, season: Season, numberOnly?: boolean) {

		console.log('checking', JSON.stringify(season));

		// Get seasons rows:
		const seasons = await page.$$eval(
			`#grid > div.k-grid-content.k-auto-scrollable > table tr`,
			(trs) => {
				return trs.map(tr => {
					return <Season> {
						number: Number(tr.childNodes[0].textContent),
						name: tr.childNodes[1].textContent,
						overview: tr.childNodes[2].textContent,
					};
				});
			}
		);
		console.log('seasons:', JSON.stringify(seasons));
		if (!seasons) {
			throw new Errors.NotFound('season rows on ' + page.url());
		}

		// Find season with same number:
		const seasonToCheck = seasons.find(s => s.number === season.number);
		if (!seasonToCheck) {
			console.log('season not found:', season.number);
			return false;
		}
		console.log('seasonToCheck:', JSON.stringify(seasonToCheck));

		// Compare:
		if (!numberOnly) {
			return (
				( !season.name || season.name === seasonToCheck.name ) &&
				( !season.overview || season.overview === seasonToCheck.overview )
			);
		}

		return true;
	}

	// =======================================================
	// == EPISODES
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

	async function addNewEpisode(page: puppeteer.Page, episode: Episode) {

		// === Open the "Edit" modal windows ===

		const addBtn = await page.$(SELECTORS.EPISODES.ADD_BTN);
		if (!addBtn) {
			throw new Errors.NotFound('"Add New Episode" button on ' + page.url());
		}

		await addBtn?.click();
		const input = await page.waitForSelector(SELECTORS.EPISODES.NUMBER_INPUT);
		if (!input) {
			throw new Errors.NotFound('"Episode Number" input on ' + page.url());
		}

		// === Input episode data ===
		// (Number input is last because of autotabbing from Number to Name inputs)

		await page.type(SELECTORS.EPISODES.NAME_INPUT, episode.name);
		await page.type(SELECTORS.EPISODES.OVERVIEW_INPUT, episode.overview);
		await page.type(SELECTORS.EPISODES.AIR_DATE_INPUT, episode.date);
		await page.type(SELECTORS.EPISODES.NUMBER_INPUT, episode.number.toString());

		// === Submit form ===

		await page.click(SELECTORS.EPISODES.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.EPISODES.NUMBER_INPUT, { hidden: true });
	}

}