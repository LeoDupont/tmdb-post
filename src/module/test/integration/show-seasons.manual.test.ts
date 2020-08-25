/**
 * Notes on testing this module:
 *
 * Since there is no staging TMDb environment for us and we can't delete what we post,
 * we must find TV shows and seasons and episodes that are not currently recorded
 * in TMDb to do our tests, and use a unique set of data for each successful post...
 *
 * It is advised to do tests with minimum data each time (for example, only 2 episodes at a time to test posting multiple episodes) to let underrepresented shows last longer for our tests.
 *
 * This is why this file is ignored by `npm run test`.
 * It can be run manually via `npx jest seasons`.
 *
 */

import { Season } from "../../data/tv-show";
import { TestHelpers } from "../test-helpers";
import { TmdbPost } from "../../tmdb-post";
import { Status } from "../../data/feedback";

describe('ShowSeasons', () => {

	// =======================================================
	// == SEASONS
	// =======================================================

	describe('Posting seasons', () => {

		const UNIQUE_DATA = {
			showID: <string> '12121-nouvelle-star',
			existingSeason: <Season> { number: 12, overview: ' ' },
			newSeason: <Season> { number: 14, name: undefined, overview: undefined },
			language: 'en-US',
		};

		let tmdb: TmdbPost;

		beforeAll(async () => {
			tmdb = await TestHelpers.initAndLogInTmdb();
		}, 30000);
		afterAll(() => {
			return tmdb.destroy();
		}, 30000);

		test.skip('can ignore an existing season', async () => {
			const feedback = await tmdb.postSeason(
				UNIQUE_DATA.showID,
				UNIQUE_DATA.existingSeason,
				{ allowUpdate: false, translation: UNIQUE_DATA.language },
			);
			expect(feedback.status).toBe(Status.IGNORED);
		}, 30000);

		test.skip('can update an existing season', async () => {
			const feedback = await tmdb.postSeason(
				UNIQUE_DATA.showID,
				UNIQUE_DATA.existingSeason,
				{ allowUpdate: false, translation: UNIQUE_DATA.language },
			);
			expect([Status.UPDATED, Status.UNCHANGED]).toContain(feedback.status);
		}, 30000);

		test.skip('can post a new season', async () => {
			const feedback = await tmdb.postSeason(
				UNIQUE_DATA.showID,
				UNIQUE_DATA.newSeason,
				{ allowUpdate: false, translation: UNIQUE_DATA.language },
			);
			expect(feedback.status).toBe(Status.ADDED);
		}, 30000);

	});

});