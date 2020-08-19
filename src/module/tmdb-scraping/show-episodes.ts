import puppeteer from 'puppeteer';
import { Browser } from '../browser';
import { Navigation } from './navigation';
import { Errors } from '../errors';
import { Season, Episode } from '../data/tv-show';
import { InterfaceHelpers } from './interface-helpers';
import { DatesHelpers } from '../data/dates-helpers';
import { parsed } from 'yargs';

export module ShowEpisodes {

	const SELECTORS = {
		ADD_BTN: '#grid > div.k-header.k-grid-toolbar > a',
		NUMBER_INPUT_CONTAINER: 'div[data-container-for="episode_number"] > span',
		NAME_INPUT: '#en-US_name_text_input_field',
		OVERVIEW_INPUT: '#en-US_overview_text_box_field',
		AIR_DATE_INPUT: '#air_date_date_picker_field',
		SAVE_BTN: '.k-edit-buttons.k-state-default > a.k-button.k-button-icontext.k-primary.k-grid-update',
		TABLE_ROWS: '#grid > div.k-grid-content.k-auto-scrollable > table tr',
	};

	type EpisodeTableRow = {
		episode: Episode,
		editBtn: puppeteer.ElementHandle | null,
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

		const successes: boolean[] = [];
		for (const episode of episodes) {

			const episodeRow = await getEpisodeTableRow(page, episode);

			// Update episode:
			if (episodeRow) {
				if (allowUpdate) {
					console.log('updating episode...');
					successes.push(await updateEpisode(page, episodeRow, episode));
					continue;
				}
				successes.push(true);
				continue;
			}

			successes.push(await addNewEpisode(page, episode));
		}

		return successes;
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
		const input = await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER);
		if (!input) {
			throw new Errors.NotFound('"Episode Number" input on ' + page.url());
		}

		// === Input episode data ===
		// (Number input is last because of autotabbing from Number to Name inputs)

		await page.type(SELECTORS.NAME_INPUT, episode.name);
		await page.type(SELECTORS.OVERVIEW_INPUT, episode.overview);

		await InterfaceHelpers.replaceValue(page,
			SELECTORS.AIR_DATE_INPUT,
			episode.date
		);

		await InterfaceHelpers.setNumberInputValue(page,
			episode.number.toString(),
			SELECTORS.NAME_INPUT
		);

		// === Submit form ===

		await page.click(SELECTORS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER, { hidden: true });

		// === Check that the episode has been added ===

		return !!getEpisodeTableRow(page, episode, true);
	}

	/**
	 * Edits an existing episode entry with provided data.
	 * @param page Page open on the season's episodes edit page
	 * @param episodeRow Existing episode data and its Edit button ElementHandle
	 * @param episode Episode data to update: Name, Overview, and Air Date will be updated only if not empty. Note: Episode Number cannot be updated and is used as an identifier.
	 */
	async function updateEpisode(page: puppeteer.Page, episodeRow: EpisodeTableRow, episode: Episode) {

		// === Open the "Edit" modal windows ===

		if (!episodeRow.editBtn) {
			throw new Errors.NotFound(`edit button for episode row ${episodeRow.episode.number} on ${page.url()}`);
		}
		episodeRow.editBtn.click();

		const input = await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER);
		if (!input) {
			throw new Errors.NotFound('"Episode Number" input on ' + page.url());
		}

		// === Input episode data ===

		if (episode.name && episode.name !== episodeRow.episode.name) {
			await InterfaceHelpers.replaceValue(page,
				SELECTORS.NAME_INPUT,
				episode.name
			);
		}
		if (episode.overview && episode.overview !== episodeRow.episode.overview) {
			await InterfaceHelpers.replaceValue(page,
				SELECTORS.OVERVIEW_INPUT,
				episode.overview
			);
		}
		if (episode.date && episode.date !== episodeRow.episode.date) {
			await InterfaceHelpers.replaceValue(page,
				SELECTORS.AIR_DATE_INPUT,
				episode.date
			);
		}

		// === Submit form ===

		await page.click(SELECTORS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER, { hidden: true });

		// === Check that the season has been updated ===

		return !!getEpisodeTableRow(page, episode, true);
	}

	// =======================================================
	// == EPISODES CHECKING
	// =======================================================

	/**
	 * Looks for a specific episode number on the episodes table.
	 * Can narrow its search with Episode Name, Overview, and Air Date.
	 * @param page Page open on the season's episodes edit page
	 * @param episode Episode to look for
	 * @param compareInfo `true` if we want to check that the Name, Overview, and Air Date of the existing episode are the same as the provided `episode` ones. If `false`, only the episode number is checked.
	 */
	async function getEpisodeTableRow(
		page: puppeteer.Page,
		episode: Episode,
		compareInfo: boolean = false
	): Promise<EpisodeTableRow | undefined> {

		console.log('checking', JSON.stringify(episode));

		// === Parse ===

		// Getting an ElementHandle on each row of the episodes table:
		const table = await page.waitForSelector(SELECTORS.TABLE_ROWS);
		if (!table) {
			throw new Errors.NotFound('episodes table did not show up on ' + page.url());
		}
		const rows = await page.$$(SELECTORS.TABLE_ROWS);

		// Parsing table rows and getting an ElementHandle on the edit buttons:
		const episodesRows: EpisodeTableRow[] = [];
		for (const row of rows) {

			const parsedEpisode = await row.evaluate(tr => ({
				number: Number(tr.childNodes[0].textContent),
				name: tr.childNodes[1].textContent,
				overview: tr.childNodes[2].textContent,
				date: tr.childNodes[3].textContent,
			} as Episode));

			parsedEpisode.date = DatesHelpers.MMDDYYYYtoYYYYMMDD(parsedEpisode.date);

			episodesRows.push({
				episode: parsedEpisode,
				editBtn: await row.$('td:nth-child(5) > a'),
			});
		}
		if (episodesRows.length < 1) {
			throw new Errors.NotFound('episodes rows on ' + page.url());
		}

		console.log('episodesRows:', JSON.stringify(episodesRows.map(r => r.episode)));

		// === Compare ===

		// Find episode with same number:
		const episodeRowToCheck = episodesRows.find(s =>
			s.episode.number === episode.number
		);
		if (!episodeRowToCheck) {
			console.log('episode not found:', episode.number);
			return undefined;
		}
		console.log('episodeRowToCheck:', JSON.stringify(episodeRowToCheck.episode));

		// Further comparison if needed:
		if (compareInfo) {
			// If provided episode name, overview, or air date are different:
			if (
				( episode.name &&
					episode.name !== episodeRowToCheck.episode.name ) ||
				( episode.overview &&
					episode.overview !== episodeRowToCheck.episode.overview ) ||
				( episode.date &&
					episode.date !== episodeRowToCheck.episode.date )
			) {
				return undefined;
			}
		}

		return episodeRowToCheck;
	}
}