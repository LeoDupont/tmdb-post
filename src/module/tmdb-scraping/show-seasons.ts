import puppeteer from 'puppeteer';
import { Browser } from '../browser';
import { Navigation } from './navigation';
import { Errors } from '../errors';
import { Season, Episode } from '../data/tv-show';
import { InterfaceHelpers } from './interface-helpers';

export module ShowSeasons {

	const SELECTORS = {
		ADD_BTN: '#grid > div.k-header.k-grid-toolbar > a',
		NUMBER_INPUT_CONTAINER: 'div[data-container-for="season_number"] > span',
		NAME_INPUT: '#en-US_name_text_input_field',
		OVERVIEW_INPUT: '#en-US_overview_text_box_field',
		SAVE_BTN: '.k-edit-buttons.k-state-default > a.k-button.k-button-icontext.k-primary.k-grid-update',
		TABLE_ROWS: '#grid > div.k-grid-content.k-auto-scrollable > table tr',
	};

	type SeasonTableRow = {
		season: Season,
		editBtn: puppeteer.ElementHandle | null,
	};

	// =======================================================
	// == POSTING SEASONS
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

		const seasonRow = await getSeasonTableRow(page, season);

		// Update season:
		if (seasonRow) {
			if (allowUpdate) {
				console.log('updating season...');
				return updateSeason(page, seasonRow, season);
			}
			return true;
		}

		// Add New Season:
		console.log('adding season...', JSON.stringify(season));
		return addNewSeason(page, season);
	}

	// =======================================================
	// == FORM FILLING (Add/Update)
	// =======================================================

	/**
	 * Adds a new season on a TV show's seasons edit page.
	 * @param page Page open on the show's seasons edit page
	 * @param season Season to post. `name` default to `'Season N'` (without zero-padding) and `overview` defaults to an empty string.
	 * @returns `true` if the season has been added or already existed
	 */
	async function addNewSeason(page: puppeteer.Page, season: Season) {

		// === Open the "Edit" modal windows ===

		const addBtn = await page.$(SELECTORS.ADD_BTN);
		if (!addBtn) {
			throw new Errors.NotFound('"Add New Season" button on ' + page.url());
		}

		await addBtn?.click();
		const input = await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER);
		if (!input) {
			throw new Errors.NotFound('"Season Number" input on ' + page.url());
		}

		// === Input season data ===
		// (Number input is last because of autotabbing from Number to Name inputs)

		await page.type(SELECTORS.OVERVIEW_INPUT, season.overview || '');
		await page.type(SELECTORS.NAME_INPUT, season.name || `Season ${season.number}`);

		await InterfaceHelpers.setNumberInputValue(page,
			season.number.toString(),
			SELECTORS.NAME_INPUT
		);

		// === Submit form ===

		await page.click(SELECTORS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER, { hidden: true });

		// === Check that the season has been added ===

		return !!getSeasonTableRow(page, season, true);
	}

	/**
	 * Edits an existing season entry with provided data.
	 * @param page Page open on the show's seasons edit page
	 * @param seasonRow Existing season data and its Edit button Element
	 * @param season Season data to update: Name and Overview will be updated only if not empty. Note: Season Number cannot be updated and is used as an identifier.
	 */
	async function updateSeason(page: puppeteer.Page, seasonRow: SeasonTableRow, season: Season) {

		// === Open the "Edit" modal windows ===

		if (!seasonRow.editBtn) {
			throw new Errors.NotFound(`edit button for season row ${seasonRow.season.number} on ${page.url()}`);
		}
		seasonRow.editBtn.click();

		const input = await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER);
		if (!input) {
			throw new Errors.NotFound('"Season Number" input on ' + page.url());
		}

		// === Input season data ===

		if (season.name && season.name !== seasonRow.season.name) {
			await InterfaceHelpers.replaceValue(page,
				SELECTORS.NAME_INPUT,
				season.name
			);
		}
		if (season.overview && season.overview !== seasonRow.season.overview) {
			await InterfaceHelpers.replaceValue(page,
				SELECTORS.OVERVIEW_INPUT,
				season.overview
			);
		}

		// === Submit form ===

		await page.click(SELECTORS.SAVE_BTN);

		// Wait for the modal to disappear:
		await page.waitForSelector(SELECTORS.NUMBER_INPUT_CONTAINER, { hidden: true });

		// === Check that the season has been updated ===

		return !!getSeasonTableRow(page, season, true);
	}

	// =======================================================
	// == SEASONS CHECKING
	// =======================================================

	/**
	 * Looks for a specific season number on the seasons table.
	 * Can narrow its search with Season Name and Overview.
	 * @param page Page open on the show's seasons edit page
	 * @param season Season to look for
	 * @param compareInfo `true` if we want to check that the Name and Overview of the existing season are the same as the provided `season` ones. If `false`, only the season number is checked.
	 */
	async function getSeasonTableRow(
		page: puppeteer.Page,
		season: Season,
		compareInfo: boolean = false
	): Promise<SeasonTableRow | undefined> {

		console.log('checking', JSON.stringify(season));

		// === Parse ===

		// Getting an ElementHandle on each row of the seasons table:
		const table = await page.waitForSelector(SELECTORS.TABLE_ROWS);
		if (!table) {
			throw new Errors.NotFound('seasons table did not show up on ' + page.url());
		}
		const rows = await page.$$(SELECTORS.TABLE_ROWS);

		// Parsing table rows and getting an ElementHandle on the edit buttons:
		const seasonsRows: SeasonTableRow[] = [];
		for (const row of rows) {

			const parsedSeason = await row.evaluate(tr => ({
				number: Number(tr.childNodes[0].textContent),
				name: tr.childNodes[1].textContent,
				overview: tr.childNodes[2].textContent,
			} as Season));

			seasonsRows.push({
				season: parsedSeason,
				editBtn: await row.$('td:nth-child(6) > a')
			});
		}
		if (seasonsRows.length < 1) {
			throw new Errors.NotFound('season rows on ' + page.url());
		}

		console.log('seasonsRows:', JSON.stringify(seasonsRows.map(r => r.season)));

		// === Compare ===

		// Find season with same number:
		const seasonRowToCheck = seasonsRows.find(s =>
			s.season.number === season.number
		);
		if (!seasonRowToCheck) {
			console.log('season not found:', season.number);
			return undefined;
		}
		console.log('seasonRowToCheck:', JSON.stringify(seasonRowToCheck.season));

		// Further comparison if needed:
		if (compareInfo) {
			// If provided season name or overview are different:
			if (
				( season.name &&
					season.name !== seasonRowToCheck.season.name ) ||
				( season.overview &&
					season.overview !== seasonRowToCheck.season.overview )
			) {
				return undefined;
			}
		}

		return seasonRowToCheck;
	}
}